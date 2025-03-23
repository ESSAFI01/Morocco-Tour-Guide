from langchain.prompts import PromptTemplate
from langchain_cohere import CohereEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os
from fastapi import FastAPI,HTTPException,Depends,status,APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from langchain.memory import ConversationBufferMemory
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from passlib.context import CryptContext
from datetime import datetime,timedelta
from jose import jwt,JWTError
from typing import Annotated
import certifi
from pymongo import errors as pymongo_errors


load_dotenv()

cohere_key = os.getenv("COHERE_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")
qdrant_url = os.getenv("URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
mongodb = os.getenv('MONGODB')

if mongodb and mongodb.startswith("mongodb+srv://"):
    print("Using MongoDB Atlas connection string")
else:
    print("WARNING: MongoDB connection string may not be configured correctly")

#JWT config 
jwt_secret_key = os.getenv('JWT_SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION = 30


#we will use this model as it gives a dimension of 384
embeddings = CohereEmbeddings(model="embed-english-light-v3.0", cohere_api_key=cohere_key)
gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=gemini_key)
client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)

#a class to manage each user's memory session
class ConversationMemory : 
    def __init__(self):
        self.conversations =  {}  
    def get_memory(self,user_id = 'default'):
        if user_id not in self.conversations: 
            self.conversations[user_id] = ConversationBufferMemory(memory_key='chat_history',return_messages=True)
        return self.conversations[user_id]
    def clear_memory(self, user_id = 'default'):
        if user_id in self.conversations : 
            self.conversations[user_id].clear()
             

def get_relevant_info(client, embeddings, query):
    query_embedding = embeddings.embed_query(query)
    search_results = client.query_points(
        collection_name="Tourisme_in_morocco",
        query=query_embedding,
        limit=3
    ).points
    relevant_info = ""
    for hit in search_results:
        relevant_info += f"Title: {hit.payload.get('title')}\n"
        relevant_info += f"Category: {hit.payload.get('category')}\n"
        relevant_info += f"Description: {hit.payload.get('description')}\n\n"
    return relevant_info

def generate_response(gemini_llm, context, query,memory):
    chat_vars = memory.load_memory_variables({})
    chat_history = chat_vars.get('chat_history',"")
    prompt_template = """
    You are an AI-powered Moroccan tour guide. Respond in the same language as the question.
    - If the user asks about Morocco, provide detailed, engaging answers.
    - If the context lacks details, use your knowledge to enhance responses.
    - If the user asks about something unrelated to Morocco, politely respond: "I'm here to provide information about Morocco only."

    Conversation history: 
    {chat_history}
    
    Context:
    {context}

    Question:
    {question}

    Answer in a helpful, conversational tone:
    """
    prompt = PromptTemplate(template=prompt_template, input_variables=["chat_history","context", "question"])
    formatted_prompt = prompt.format(chat_history = chat_history,context=context, question=query)
    response = gemini_llm.invoke(formatted_prompt)
    response_text = response.content
    memory.save_context({'input':query},{'output' : response_text})
    return response_text


dbclient = MongoClient(mongodb, 
    tls=True, 
    tlsAllowInvalidCertificates=False,  
    tlsCAFile=certifi.where(), 
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    serverSelectionTimeoutMS=30000,
    retryWrites=True                
)
db = dbclient['MoroccoGuide']
    
try:
    # Ping the database to verify connection
    dbclient.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")

#Fastapi app 
app = FastAPI()
api_router = APIRouter(prefix="/api")
class QueryRequest(BaseModel):
    query: str
    session_id : str = 'default'
    
class User(BaseModel):
    name : str
    email : str
    password : str
    
#class to save the conversation:
class ConversationRequest(BaseModel):
    query : str
    response : str
    
#JWT config 
class Token(BaseModel):
    access_token : str
    token_type : str
    
class TokenData(BaseModel):
    username: str | None = None

pwd_context = CryptContext(schemes=['bcrypt'],deprecated="auto")
def verify_password(password,hashed_password):
    return pwd_context.verify(password,hashed_password)

def hash_password(password):
    return pwd_context.hash(password)


origins = [
    'http://localhost:5173',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://localhost',
    'https://morocco-guide-frontend--6wd5co0.gentlecoast-b445ea6c.eastus.azurecontainerapps.io',
    'https://*.gentlecoast-b445ea6c.eastus.azurecontainerapps.io'       
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)

conversation_manager = ConversationMemory()
   
#function to create the jwt token :  
def create_access_token(data:dict):
    to_encode = data.copy()
    expiration_data = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRATION)
    to_encode.update({'exp':expiration_data})
    encoded_jwt = jwt.encode(to_encode,jwt_secret_key,algorithm=ALGORITHM)
    return encoded_jwt

oauth_scheme = OAuth2PasswordBearer(tokenUrl='login')

async def get_current_user(token:Annotated[str,Depends(oauth_scheme)]):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Credentials are not valid',
        headers={'WWW-Authenticate' : 'Bearer'}
    ) 
    try:
        payload = jwt.decode(token,jwt_secret_key,algorithms=ALGORITHM)
        email: str = payload.get('sub')
        if email is None:
            raise credential_exception 
        token_data = TokenData(username=email)
    except JWTError:
        raise credential_exception
    user = db["users"].find_one({'email' : token_data.username})
    if user is None :
        raise credential_exception
    return user 
@api_router.post('/login',response_model=Token)
def login(form_data:Annotated[OAuth2PasswordRequestForm,Depends()]):
    login_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Incorrect Email and/or Password',
        headers={'WWW-Authenticate' : 'Bearer'}
    )
    
    user = db["users"].find_one({'email' : form_data.username})
    if not user : 
        raise  login_exception
    
    if not verify_password(form_data.password,user["password"]):
        raise login_exception
    access_token = create_access_token(data={'sub' : user['email']})
    return {'access_token' : access_token,'token_type':'bearer'}


@api_router.post('/tourist')
def tourist_query(request : QueryRequest,current_user : Annotated[dict,Depends(get_current_user)]):
    query = request.query
    session_id = current_user['_id']
    if not query : 
        raise HTTPException(status_code=400,detail = "Query cannot be empty")
    try : 
        memory = conversation_manager.get_memory(session_id)
        info = get_relevant_info(client,embeddings,query)
        response = generate_response(gemini_llm,info,query,memory)
        return {'Answer' : response}
    except Exception as e : 
        raise HTTPException(status_code=500,detail=f"Error ocurred : {str(e)}")


@api_router.post('/clear-conversation')
def clear_conversation(request : BaseModel,current_user : Annotated[dict,Depends(get_current_user)]):
    session_id = getattr(request,'session_id','default')
    conversation_manager.clear_memory(session_id)
    return {"status": "success", "message": "Conversation history cleared"}

@api_router.post('/createUser')
def create_user(user: User):
    try:
        existing_user = db["users"].find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        if len(user.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        hashed_password = hash_password(user.password)
        
        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "created_at": datetime.now()
        }
        
        result = db["users"].insert_one(user_data)
        
        return {
            "status": "success",
            "message": "User created successfully",
            "user_id": str(result.inserted_id)
        }
    except pymongo_errors.ServerSelectionTimeoutError as e :
        raise HTTPException(status_code=503, detail=f"Database connection error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@api_router.get('/me')
async def get_user(current_user:Annotated[dict,Depends(get_current_user)]):
    user_data = {
        'id':str(current_user.get('_id')),
        'name' :current_user.get('name'),
        'email' : current_user.get('email'),
        'created_at' : current_user.get('created_at').isoformat() if current_user.get('created_at') else None
    }
    return user_data
@api_router.post('/saveConversation')
async def save_convo(conversation: ConversationRequest, current_user: Annotated[dict, Depends(get_current_user)]):
    try:
        user_id = current_user.get('_id')
        conversation_doc = {
            'query': conversation.query,
            'response': conversation.response,
            'timestamp': datetime.now()
        }
        
        # Try to update existing conversation document
        result = db['conversation'].update_one(
            {'_id': user_id},
            {'$push': {'conversations': conversation_doc}}
        )
        
        # If no document was updated, create a new one
        if result.modified_count == 0:
            # Check if document exists but wasn't modified
            existing = db['conversation'].find_one({'_id': user_id})
            if existing:
                # Document exists but wasn't modified for some reason
                return {
                    'status': 'success',
                    'message': 'Conversation may have been saved already',
                    'user_id': str(user_id)
                }
            else:
                # Create new document with first conversation
                new_doc = {
                    '_id': user_id,
                    'user_name': current_user.get('name'),
                    'conversations': [conversation_doc]
                }
                insert_result = db['conversation'].insert_one(new_doc)
                return {
                    'status': 'success',
                    'message': 'New conversation document created',
                    'user_id': str(user_id)
                }
        
        return {
            'status': 'success',
            'message': 'Conversation saved in the database successfully',
            'user_id': str(user_id)
        }
    except pymongo_errors.ServerSelectionTimeoutError as e:
        raise HTTPException(status_code=503, detail=f"Database connection error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@app.get("/")
def read_root():
    return {"message": "Backend API is running", "routes": "Use /api/* endpoints"} 
app.include_router(api_router)