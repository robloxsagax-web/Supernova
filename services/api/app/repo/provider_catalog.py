"""Provider catalog for Genblaze.

This module defines the available AI providers and their configurations.
"""

import logging
import os
from dataclasses import dataclass, field
from typing import Optional, Callable, List

logger = logging.getLogger("api.provider_catalog")

# Configuration - these can be overridden by environment
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
TEMPERATURE = 0.7

# Model fallback list (in order of preference)
DEFAULT_MODELS = [
    "qwen/qwen3.6-flash",
    "qwen/qwen3.7-plus", 
    "qwen/qwen3.6-plus:free",
]


def _get_api_key() -> Optional[str]:
    """Get API key dynamically from environment."""
    return os.environ.get("OPENROUTER_API_KEY")


def _get_model() -> str:
    """Get model from environment variable, with fallback to defaults."""
    env_model = os.environ.get("OPENROUTER_MODEL")
    if env_model:
        logger.info(f"Using model from OPENROUTER_MODEL: {env_model}")
        return env_model
    model = DEFAULT_MODELS[0]
    logger.info(f"Using default model: {model}")
    return model


def get_available_models() -> List[str]:
    """Get list of available models for fallback."""
    env_model = os.environ.get("OPENROUTER_MODEL")
    if env_model:
        # If user specifies a model, try it first, then fall back to defaults
        models = [env_model] + DEFAULT_MODELS
        return list(dict.fromkeys(models))  # Remove duplicates, preserve order
    return DEFAULT_MODELS


@dataclass
class ProviderConfig:
    """Configuration for an AI provider."""
    
    name: str
    base_url: Optional[str] = None
    model: str = DEFAULT_MODELS[0]
    temperature: float = TEMPERATURE
    _api_key_func: Callable[[], Optional[str]] = field(default=_get_api_key, repr=False)
    
    @property
    def api_key(self) -> Optional[str]:
        """Get API key dynamically from the configured function."""
        return self._api_key_func()
    
    def is_available(self) -> bool:
        """Check if the provider is configured and available."""
        return bool(self.api_key)
    
    def log_config(self) -> None:
        """Log current provider configuration."""
        logger.info("=" * 50)
        logger.info("PROVIDER CONFIGURATION")
        logger.info("=" * 50)
        logger.info(f"Provider: {self.name}")
        logger.info(f"Model: {self.model}")
        logger.info(f"Base URL: {self.base_url or 'default'}")
        logger.info(f"Temperature: {self.temperature}")
        logger.info(f"OPENROUTER_API_KEY exists: {bool(self.api_key)}")
        logger.info(f"Available models for fallback: {get_available_models()}")
        logger.info("=" * 50)


# Provider configurations
PROVIDERS = {
    "openai": ProviderConfig(
        name="openai",
        base_url=OPENROUTER_BASE_URL,
        model=_get_model(),  # Get from env or default
        temperature=TEMPERATURE
    )
}


def get_provider(provider_name: str = "openai") -> Optional[ProviderConfig]:
    """Get provider configuration by name."""
    return PROVIDERS.get(provider_name)


def get_default_provider() -> Optional[ProviderConfig]:
    """Get the default provider configuration."""
    return PROVIDERS.get("openai")
