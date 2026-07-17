"""Genblaze API Service - Main Application.

FastAPI application for script generation using Genblaze.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import script_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("api.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info("Starting Genblaze API Service")
    yield
    logger.info("Shutting down Genblaze API Service")


# Create FastAPI application
app = FastAPI(
    title="Genblaze Script Generation API",
    description="Marketing script generation service using Genblaze and OpenRouter",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Include routers
app.include_router(script_router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Genblaze Script Generation API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
