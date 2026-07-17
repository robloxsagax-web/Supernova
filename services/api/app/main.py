"""Genblaze API Service - Main Application.

FastAPI application for script generation using Genblaze.
Deployed separately from Next.js frontend on Vercel.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import script_router
from app.repo.provider_catalog import get_default_provider, get_available_models

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
    logger.info(f"OPENROUTER_API_KEY configured: {bool(os.environ.get('OPENROUTER_API_KEY'))}")
    
    # Log provider configuration at startup
    provider = get_default_provider()
    if provider:
        logger.info("=" * 50)
        logger.info("PROVIDER CONFIGURATION")
        logger.info("=" * 50)
        logger.info(f"Provider: {provider.name}")
        logger.info(f"Model: {provider.model}")
        logger.info(f"Base URL: {provider.base_url}")
        logger.info(f"Available models: {get_available_models()}")
        logger.info("=" * 50)
    
    yield
    logger.info("Shutting down Genblaze API Service")


# Create FastAPI application
app = FastAPI(
    title="Genblaze Script Generation API",
    description="Marketing script generation service using Genblaze and OpenRouter",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS - allow requests from Vercel frontend
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
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
    provider = get_default_provider()
    return {
        "status": "healthy",
        "provider": "Genblaze",
        "model": provider.model if provider else "unknown"
    }
