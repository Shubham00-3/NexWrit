from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="NexWrit API", description="AI-Assisted Document Authoring Platform Backend")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:5174",  # Alternative Vite port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to NexWrit API"}

from app.routers import auth, projects, generate, export

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(generate.router)
app.include_router(export.router)
