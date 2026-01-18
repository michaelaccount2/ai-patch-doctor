"""Telemetry module for anonymous usage tracking.

Purpose: Help maintainers understand which AI issues users are facing
Privacy: No user identification, tracking, or sensitive data collection

Collected data:
- install_id (random UUID, locally generated on first run)
- cli_version
- os, arch
- target (check type)
- provider_type
- status (success/warning/error)
- duration_bucket
- timestamp

Strictly forbidden:
- Prompts, payloads, request bodies
- API keys, base URLs, file paths
- Repo names, model names
- Any user or company identifiers
"""

import os
import json
import platform
import uuid
from typing import Optional, Dict, Any
from datetime import datetime
import threading
import urllib.request
import urllib.error


TELEMETRY_ENDPOINT = 'https://telemetry.aibadgr.com/v1/telemetry/events'
EVENT_NAME = 'doctor_run'
TELEMETRY_TIMEOUT = 2  # 2 seconds max


def generate_install_id() -> str:
    """Generate a random install_id (UUID v4)."""
    return str(uuid.uuid4())


def get_duration_bucket(duration_seconds: float) -> str:
    """Calculate duration bucket for anonymization.
    
    Buckets: <1s, 1-5s, 5-10s, 10-30s, 30-60s, >60s
    """
    if duration_seconds < 1:
        return '<1s'
    elif duration_seconds < 5:
        return '1-5s'
    elif duration_seconds < 10:
        return '5-10s'
    elif duration_seconds < 30:
        return '10-30s'
    elif duration_seconds < 60:
        return '30-60s'
    else:
        return '>60s'


def is_telemetry_enabled(
    no_telemetry_flag: bool,
    config_telemetry_enabled: Optional[bool]
) -> bool:
    """Check if telemetry is enabled based on multiple opt-out mechanisms.
    
    Respects:
    - --no-telemetry flag
    - AI_PATCH_TELEMETRY=0 environment variable
    - telemetryEnabled=false in config
    
    Default: enabled (opt-out model)
    """
    # Check flag first
    if no_telemetry_flag:
        return False
    
    # Check environment variable
    env_value = os.getenv('AI_PATCH_TELEMETRY')
    if env_value in ('0', 'false', 'False', 'FALSE'):
        return False
    
    # Check config (default to true if not specified)
    if config_telemetry_enabled is False:
        return False
    
    return True


def send_telemetry_event(event: Dict[str, Any]) -> None:
    """Send telemetry event (fire-and-forget).
    
    - Never blocks or slows the CLI
    - Fails silently on network errors
    - Never changes CLI exit codes
    - Times out after 2 seconds
    """
    # Fire-and-forget: run in background thread
    thread = threading.Thread(target=_send_event_async, args=(event,), daemon=True)
    thread.start()


def _send_event_async(event: Dict[str, Any]) -> None:
    """Internal function to send telemetry event in background thread."""
    try:
        data = json.dumps(event).encode('utf-8')
        
        req = urllib.request.Request(
            TELEMETRY_ENDPOINT,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': f"ai-patch-cli/{event.get('cli_version', 'unknown')}"
            },
            method='POST'
        )
        
        # Send request with timeout
        with urllib.request.urlopen(req, timeout=TELEMETRY_TIMEOUT) as response:
            # Drain response to free up resources
            response.read()
    except Exception:
        # Silently ignore all errors
        pass


def send_doctor_run_event(
    install_id: str,
    cli_version: str,
    target: str,
    provider: str,
    status: str,
    duration_seconds: float
) -> None:
    """Create and send a doctor_run telemetry event."""
    event = {
        'event': EVENT_NAME,
        'install_id': install_id,
        'cli_version': cli_version,
        'os': platform.system().lower(),
        'arch': platform.machine(),
        'target': target,
        'provider_type': provider,
        'status': status,
        'duration_bucket': get_duration_bucket(duration_seconds),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }
    
    send_telemetry_event(event)
