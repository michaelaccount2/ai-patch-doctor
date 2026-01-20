/**
 * Telemetry module for anonymous usage tracking using PostHog
 * 
 * Purpose: Help maintainers understand which AI issues users are facing
 * Privacy: No user identification, tracking, or sensitive data collection
 * 
 * Collected data:
 * - install_id (random UUID, locally generated on first run)
 * - cli_version
 * - os, arch
 * - target (check type)
 * - provider_type
 * - status (success/warning/error)
 * - duration_bucket
 * - timestamp
 * 
 * Strictly forbidden:
 * - Prompts, payloads, request bodies
 * - API keys, base URLs, file paths
 * - Repo names, model names
 * - Any user or company identifiers
 */

import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { PostHog } from 'posthog-node';

// PostHog configuration
const POSTHOG_API_KEY = 'phc_2MqZqgBMqVLmqmqZQqBMqVLmqmqZQqBMqVLmqmqZQqB';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const EVENT_NAME = 'doctor_run';

// Initialize PostHog client
let posthogClient: PostHog | null = null;

function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1, // Flush immediately
      flushInterval: 0, // Don't batch
    });
  }
  return posthogClient;
}

export interface TelemetryEvent {
  cli_version: string;
  os: string;
  arch: string;
  target: string;
  provider_type: string;
  status: 'success' | 'warning' | 'error';
  duration_bucket: string;
}

/**
 * Generate a random install_id (UUID v4)
 */
export function generateInstallId(): string {
  return uuidv4();
}

/**
 * Calculate duration bucket for anonymization
 * Buckets: <1s, 1-5s, 5-10s, 10-30s, 30-60s, >60s
 */
export function getDurationBucket(durationSeconds: number): string {
  if (durationSeconds < 1) return '<1s';
  if (durationSeconds < 5) return '1-5s';
  if (durationSeconds < 10) return '5-10s';
  if (durationSeconds < 30) return '10-30s';
  if (durationSeconds < 60) return '30-60s';
  return '>60s';
}

/**
 * Check if telemetry is enabled based on multiple opt-out mechanisms
 * 
 * Respects:
 * - --no-telemetry flag
 * - AI_PATCH_TELEMETRY=0 environment variable
 * - telemetryEnabled=false in config
 * 
 * Default: enabled (opt-out model)
 */
export function isTelemetryEnabled(
  noTelemetryFlag: boolean,
  configTelemetryEnabled: boolean | undefined
): boolean {
  // Check flag first
  if (noTelemetryFlag) {
    return false;
  }

  // Check environment variable
  const envValue = process.env.AI_PATCH_TELEMETRY;
  if (envValue === '0' || envValue === 'false') {
    return false;
  }

  // Check config (default to true if not specified)
  if (configTelemetryEnabled === false) {
    return false;
  }

  return true;
}

/**
 * Send telemetry event using PostHog (fire-and-forget)
 * 
 * - Never blocks or slows the CLI
 * - Fails silently on network errors
 * - Never changes CLI exit codes
 */
export function sendTelemetryEvent(installId: string, properties: TelemetryEvent): void {
  // Fire-and-forget: don't await, don't block
  try {
    const client = getPostHogClient();
    
    // Capture event with PostHog
    client.capture({
      distinctId: installId,
      event: EVENT_NAME,
      properties: properties,
    });

    // Shutdown client after a short delay to ensure event is sent
    setTimeout(() => {
      client.shutdown().catch(() => {
        // Silently ignore shutdown errors
      });
    }, 100);
  } catch (error) {
    // Silently ignore all errors
  }
}

/**
 * Create and send a doctor_run telemetry event
 */
export function sendDoctorRunEvent(
  installId: string,
  cliVersion: string,
  target: string,
  provider: string,
  status: 'success' | 'warning' | 'error',
  durationSeconds: number
): void {
  const properties: TelemetryEvent = {
    cli_version: cliVersion,
    os: os.platform(),
    arch: os.arch(),
    target,
    provider_type: provider,
    status,
    duration_bucket: getDurationBucket(durationSeconds),
  };

  sendTelemetryEvent(installId, properties);
}
