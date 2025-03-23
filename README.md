# Morocco Tour Guide - AI-Powered Virtual Tourist Guide

![Morocco Tour Guide Logo](https://via.placeholder.com/800x200?text=Morocco+Tour+Guide)

An intelligent virtual guide that provides personalized information about Morocco's attractions, culture, and travel recommendations using **Retrieval Augmented Generation (RAG)** and **LLM technologies**.

## 🌟 Features
- **Intelligent Conversational Interface**: Chat naturally with an AI tour guide specialized in Moroccan tourism.
- **Personalized Recommendations**: Get customized travel suggestions based on your interests.
- **Cultural Context**: Learn about Moroccan history, traditions, cuisine, and local customs.
- **Up-to-date Information**: Access information about attractions, accommodations, and travel logistics.
- **User Authentication**: Secure login system to save conversations and preferences.

## 🏗️ Architecture
This application uses a modern architecture with the following components:

- **Frontend**: React-based UI with responsive design for all devices.
- **Backend**: FastAPI serving the application logic and AI integration.
- **RAG System**: Retrieval Augmented Generation providing accurate, context-aware responses.
- **Vector Database**: Qdrant storing embeddings of Moroccan tourism information.
- **User Database**: MongoDB Atlas for user data and conversation history.
- **AI Services**: Integration with Google's Gemini for response generation and Cohere for text embeddings.
- **Deployment**: Containerized with Docker and deployed on Azure Container Apps.

![Architecture Diagram](https://via.placeholder.com/800x500?text=Architecture+Diagram)

## 🚀 Getting Started
### Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (for frontend development)
- [Python 3.9+](https://www.python.org/) (for backend development)
- API keys for:
  - MongoDB Atlas
  - Google Gemini
  - Cohere
  - Qdrant

### Environment Variables
Create a **.env** file in the root directory and add the following variables:

```env
MONGODB=your_mongodb_connection_string
URL=http://localhost:8000
JWT_SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
COHERE_API_KEY=your_cohere_api_key
QDRANT_API_KEY=your_qdrant_api_key
```

### Running with Docker
#### Clone the repository:
```bash
git clone https://github.com/yourusername/moroccan-tour-guide.git
cd moroccan-tour-guide
```

#### Start the application using Docker Compose:
```bash
docker-compose up -d
```

#### Access the application:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

## 🛠️ Local Development
### Frontend
```bash
cd frontend/vite-project
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 API Documentation
The API documentation is available at **/docs** or **/redoc** when the backend is running.

### Key Endpoints:
- `/api/login` - User authentication
- `/api/register` - User registration
- `/api/chat` - Chat with the Morocco Tour Guide
- `/api/attractions` - Get information about attractions
- `/api/user` - User profile management

## 🌐 Deployment
The application is deployed on **Azure Container Apps**:

- **Frontend**: [Morocco Guide Frontend](https://morocco-guide-frontend.gentlecoast-b445ea6c.eastus.azurecontainerapps.io)
- **Backend**: [Morocco Guide Backend](https://morocco-guide-env.gentlecoast-b445ea6c.eastus.azurecontainerapps.io)

### Deployment Instructions
#### Azure Container Apps Setup:
1. Create a **Container Apps Environment**.
2. Deploy the frontend and backend containers.
3. Configure environment variables.
4. Enable ingress.

#### Custom Domain (Optional):
1. Purchase a domain.
2. Configure DNS settings.
3. Set up a custom domain in Azure.
4. Configure an SSL certificate.

## 🛠️ Technology Stack
### **Frontend**
- React
- Tailwind CSS
- Vite
- Nginx (for production serving)

### **Backend**
- FastAPI
- JWT Authentication
- MongoDB (via PyMongo)
- RAG (Retrieval Augmented Generation)

### **AI & Data**
- Google Gemini API
- Cohere Embedding API
- Qdrant Vector Database
- Web scraping pipeline for data collection

### **DevOps**
- Docker & Docker Compose
- Azure Container Apps
- GitHub Actions (CI/CD)

## 💡 Future Enhancements
- Multi-language support (Arabic, French, Spanish)
- Offline mode for common queries
- Integration with booking services
- Mobile application
- Voice interface
- Image recognition for landmarks
- Augmented reality features

## 👥 Contributors
- **Anass Essafi**

---
Made with ❤️ for Moroccan tourism 🇲🇦
