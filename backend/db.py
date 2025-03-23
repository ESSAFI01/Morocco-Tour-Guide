from langchain.prompts import PromptTemplate
from langchain_cohere import CohereEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os
from fastapi import FastAPI,HTTPException,Depends,status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from langchain.memory import ConversationBufferMemory
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from passlib.context import CryptContext
from datetime import datetime 

cohere_key = os.getenv("COHERE_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")
qdrant_url = os.getenv("URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
mongodb = os.getenv('MONGODB')
#JWT config 
jwt_secret_key = os.getenv('JWT_SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION = 30

dbclient = MongoClient(mongodb,server_api = ServerApi('1'))
db = dbclient['MoroccoGuide']
collection = dbclient['Guide']

users_collection = db["users"]  # Collection gets created when we insert data

# Insert a sample user
user_data = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "hashed_password_here",
    "created_at": datetime.now()
}

if db["users"].find_one({"email": "test@example.com"}) : 
    print('ok')
