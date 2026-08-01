"""Genblaze API Service - Main Application.

FastAPI application for script generation, market intelligence, and B2 storage.
Deployed separately from Next.js frontend on Vercel.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import script_router, market_intelligence_router, storage_router
from app.repo.provider_catalog import get_default_provider, get_available_models, get_market_intel_provider, get_market_intel_models
from app.repo.b2_storage import get_storage

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
    logger.info(f"B2 Storage configured: {get_storage().is_available()}")
    
    # Log script provider configuration at startup
    provider = get_default_provider()
    if provider:
        logger.info("=" * 50)
        logger.info("SCRIPT PROVIDER CONFIGURATION")
        logger.info("=" * 50)
        logger.info(f"Provider: {provider.name}")
        logger.info(f"Model: {provider.model}")
        logger.info(f"Base URL: {provider.base_url}")
        logger.info(f"Available models: {get_available_models()}")
        logger.info("=" * 50)
    
    # Log market intelligence provider configuration at startup
    market_provider = get_market_intel_provider()
    if market_provider:
        logger.info("=" * 50)
        logger.info("MARKET INTELLIGENCE PROVIDER CONFIGURATION")
        logger.info("=" * 50)
        logger.info(f"Provider: {market_provider.name}")
        logger.info(f"Model: {market_provider.model}")
        logger.info(f"Base URL: {market_provider.base_url}")
        logger.info(f"Available models: {get_market_intel_models()}")
        logger.info("=" * 50)
    
    yield
    logger.info("Shutting down Genblaze API Service")


# Create FastAPI application
app = FastAPI(
    title="Genblaze API Service",
    description="Marketing script generation, market intelligence, and B2 storage service",
    version="1.2.0",
    lifespan=lifespan
)

# Configure CORS - allow requests from Vercel frontend
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Include routers
app.include_router(script_router)
app.include_router(market_intelligence_router)
app.include_router(storage_router)


@app.get("/")
async def root():
    """Root endpoint."""
    storage = get_storage()
    return {
        "service": "Genblaze API Service",
        "version": "1.2.0",
        "status": "running",
        "endpoints": ["/script", "/market-intelligence", "/storage"],
        "storage": {
            "provider": "Backblaze B2",
            "available": storage.is_available()
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    provider = get_default_provider()
    market_provider = get_market_intel_provider()
    storage = get_storage()
    return {
        "status": "healthy",
        "provider": "Genblaze",
        "script_model": provider.model if provider else "unknown",
        "market_intel_model": market_provider.model if market_provider else "unknown",
        "storage": {
            "provider": "Backblaze B2",
            "available": storage.is_available()
        }
    }
