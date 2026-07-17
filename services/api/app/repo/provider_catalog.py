"""Provider catalog for Genblaze.

This module defines the available AI providers and their configurations.
"""

import os
from dataclasses import dataclass, field
from typing import Optional, Callable

# Configuration - these can be overridden by environment
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = "qwen/qwen-turbo"
TEMPERATURE = 0.7


def _get_api_key() -> Optional[str]:
    """Get API key dynamically from environment."""
    return os.environ.get("OPENROUTER_API_KEY")


@dataclass
class ProviderConfig:
    """Configuration for an AI provider."""
    
    name: str
    base_url: Optional[str] = None
    model: str = MODEL
    temperature: float = TEMPERATURE
    _api_key_func: Callable[[], Optional[str]] = field(default=_get_api_key, repr=False)
    
    @property
    def api_key(self) -> Optional[str]:
        """Get API key dynamically from the configured function."""
        return self._api_key_func()
    
    def is_available(self) -> bool:
        """Check if the provider is configured and available."""
        return bool(self.api_key)


# Provider configurations
PROVIDERS = {
    "openai": ProviderConfig(
        name="openai",
        base_url=OPENROUTER_BASE_URL,
        model=MODEL,
        temperature=TEMPERATURE
    )
}


def get_provider(provider_name: str = "openai") -> Optional[ProviderConfig]:
    """Get provider configuration by name."""
    return PROVIDERS.get(provider_name)


def get_default_provider() -> Optional[ProviderConfig]:
    """Get the default provider configuration."""
    return PROVIDERS.get("openai")
