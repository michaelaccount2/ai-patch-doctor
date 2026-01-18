/**
 * Telemetry module for anonymous usage tracking
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

import * as https from 'https';
import * as http from 'http';
import * as os from 'os';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';

const TELEMETRY_ENDPOINT = 'https://telemetry.aibadgr.com/v1/telemetry/events';
const EVENT_NAME = 'doctor_run';
const TELEMETRY_TIMEOUT = 2000; // 2 seconds max

export interface TelemetryEvent {
  event: string;
  install_id: string;
  cli_version: string;
  os: string;
  arch: string;
  target: string;
  provider_type: string;
  status: 'success' | 'warning' | 'error';
  duration_bucket: string;
  timestamp: string;
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
 * Send telemetry event (fire-and-forget)
 * 
 * - Never blocks or slows the CLI
 * - Fails silently on network errors
 * - Never changes CLI exit codes
 * - Times out after 2 seconds
 */
export function sendTelemetryEvent(event: TelemetryEvent): void {
  // Fire-and-forget: don't await, don't block
  sendEventAsync(event).catch(() => {
    // Silently ignore all errors
  });
}

/**
 * Internal async function to send telemetry event
 */
async function sendEventAsync(event: TelemetryEvent): Promise<void> {
  return new Promise((resolve) => {
    try {
      const url = new URL(TELEMETRY_ENDPOINT);
      const postData = JSON.stringify(event);

      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': `ai-patch-cli/${event.cli_version}`,
        },
        timeout: TELEMETRY_TIMEOUT,
      };

      const protocol = url.protocol === 'https:' ? https : http;
      const req = protocol.request(options, (res) => {
        // Drain response to free up resources
        res.on('data', () => {});
        res.on('end', () => resolve());
        res.on('error', () => resolve());
      });

      req.on('error', () => resolve());
      req.on('timeout', () => {
        req.destroy();
        resolve();
      });

      req.write(postData);
      req.end();
    } catch (error) {
      // Silently ignore all errors
      resolve();
    }
  });
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
  const event: TelemetryEvent = {
    event: EVENT_NAME,
    install_id: installId,
    cli_version: cliVersion,
    os: os.platform(),
    arch: os.arch(),
    target,
    provider_type: provider,
    status,
    duration_bucket: getDurationBucket(durationSeconds),
    timestamp: new Date().toISOString(),
  };

  sendTelemetryEvent(event);
}
