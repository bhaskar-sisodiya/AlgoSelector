import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 🔥 Add ml-logic folder to Python path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "ml-logic")
    )
)
sys.path.append(os.path.dirname(os.path.abspath(__file__))) # Add backend to path

# Database
from database.database import engine
from models.user import Base  # 🔥 use Base, not User
from routes import auth, upload, profiling, preprocess, recommendation

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoML Backend",
    description="FastAPI backend for React + ML AutoML Assistant",
    version="1.0.0"
)

# 🌍 CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Register routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(profiling.router)
app.include_router(preprocess.router)
app.include_router(recommendation.router)
from routes import automl, monitoring, report
app.include_router(automl.router)
app.include_router(monitoring.router)
app.include_router(report.router)


@app.get("/")
def root():
    return {"message": "🚀 AutoML Backend is running successfully!"}
