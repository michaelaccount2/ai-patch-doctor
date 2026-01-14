"""Configuration management for AI Patch."""

import os
from typing import Optional, List
from dataclasses import dataclass


@dataclass
class Config:
    """Configuration for AI Patch checks."""
    
    base_url: str
    api_key: str
    provider: str
    model: Optional[str] = None
    
    @classmethod
    def auto_detect(cls, provider: str = 'openai-compatible') -> 'Config':
        """Auto-detect configuration from environment variables."""
        
        if provider == 'openai-compatible':
            base_url = os.getenv('OPENAI_BASE_URL', 'https://api.openai.com')
            api_key = os.getenv('OPENAI_API_KEY', '')
            model = os.getenv('MODEL', 'gpt-3.5-turbo')
            
            # Check for common gateway env vars
            if not base_url or base_url == 'https://api.openai.com':
                # Try LiteLLM proxy
                litellm_url = os.getenv('LITELLM_PROXY_URL')
                if litellm_url:
                    base_url = litellm_url
                
                # Try Portkey
                portkey_url = os.getenv('PORTKEY_BASE_URL')
                if portkey_url:
                    base_url = portkey_url
                    
                # Try Helicone
                helicone_url = os.getenv('HELICONE_BASE_URL')
                if helicone_url:
                    base_url = helicone_url
        
        elif provider == 'anthropic':
            base_url = os.getenv('ANTHROPIC_BASE_URL', 'https://api.anthropic.com')
            api_key = os.getenv('ANTHROPIC_API_KEY', '')
            model = os.getenv('MODEL', 'claude-3-5-sonnet-20241022')
        
        elif provider == 'gemini':
            base_url = os.getenv('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com')
            api_key = os.getenv('GEMINI_API_KEY', '')
            model = os.getenv('MODEL', 'gemini-pro')
        
        else:
            base_url = os.getenv('OPENAI_BASE_URL', '')
            api_key = os.getenv('OPENAI_API_KEY', '')
            model = os.getenv('MODEL', 'gpt-3.5-turbo')
        
        return cls(
            base_url=base_url,
            api_key=api_key,
            provider=provider,
            model=model
        )
    
    def is_valid(self) -> bool:
        """Check if configuration is valid."""
        return bool(self.base_url and self.api_key)
    
    def get_missing_vars(self) -> str:
        """Get list of missing environment variables."""
        missing = []
        
        if not self.base_url:
            if self.provider == 'anthropic':
                missing.append('ANTHROPIC_BASE_URL')
            elif self.provider == 'gemini':
                missing.append('GEMINI_BASE_URL')
            else:
                missing.append('OPENAI_BASE_URL')
        
        if not self.api_key:
            if self.provider == 'anthropic':
                missing.append('ANTHROPIC_API_KEY')
            elif self.provider == 'gemini':
                missing.append('GEMINI_API_KEY')
            else:
                missing.append('OPENAI_API_KEY')
        
        return ', '.join(missing)
