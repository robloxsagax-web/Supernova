"""Provider catalog for Genblaze.

This module defines the available AI providers and their configurations.
"""

import os
from dataclasses import dataclass
from typing import Optional

# Configuration
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = "qwen/qwen-turbo"
TEMPERATURE = 0.7


@dataclass
class ProviderConfig:
    """Configuration for an AI provider."""
    
    name: str
    api_key: Optional[str]
    base_url: Optional[str] = None
    model: str = MODEL
    temperature: float = TEMPERATURE
    
    def is_available(self) -> bool:
        """Check if the provider is configured and available."""
        return bool(self.api_key)


# Provider configurations
PROVIDERS = {
    "openai": ProviderConfig(
        name="openai",
        api_key=OPENROUTER_API_KEY,
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
