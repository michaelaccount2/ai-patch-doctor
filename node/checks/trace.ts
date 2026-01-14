/**
 * Traceability checks - request IDs, correlation
 */

import fetch from 'node-fetch';
import * as crypto from 'crypto';
import { Config } from '../config';

interface CheckResult {
  status: 'pass' | 'warn' | 'fail' | 'skipped';
  findings: Array<{
    severity: 'info' | 'warning' | 'error';
    message: string;
    details?: any;
  }>;
  metrics?: Record<string, any>;
}

export async function checkTrace(config: Config): Promise<CheckResult> {
  const findings: any[] = [];
  const metrics: Record<string, any> = {};

  try {
    const url = `${config.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;

    // Generate stable request ID
    const requestId = crypto.randomUUID();

    const headers = {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
    };

    const payload = {
      model: config.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test' }],
      max_tokens: 10,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Check for request ID in response
    const providerRequestId =
      response.headers.get('x-request-id') ||
      response.headers.get('openai-request-id') ||
      response.headers.get('cf-ray');

    if (providerRequestId) {
      findings.push({
        severity: 'info',
        message: `Provider request ID found: ${providerRequestId}`,
      });
      metrics.provider_request_id = providerRequestId;
    } else {
      findings.push({
        severity: 'warning',
        message: 'No provider request ID found in response headers',
      });
    }

    // Calculate request hash for duplicate detection
    const payloadStr = JSON.stringify(Object.entries(payload).sort());
    const requestHash = crypto.createHash('sha256').update(payloadStr).digest('hex').slice(0, 16);

    metrics.request_hash = requestHash;

    findings.push({
      severity: 'info',
      message: `Generated request hash: ${requestHash} (for duplicate detection)`,
    });

    // Recommendations
    findings.push({
      severity: 'info',
      message: 'Always include X-Request-ID header for request correlation',
    });

    findings.push({
      severity: 'info',
      message: 'Log request hashes to detect duplicate API calls',
    });

    findings.push({
      severity: 'info',
      message: 'Capture provider request IDs from response headers for support tickets',
    });

    return {
      status: 'pass',
      findings,
      metrics,
    };
  } catch (error: any) {
    return {
      status: 'fail',
      findings: [
        {
          severity: 'error',
          message: `Trace check failed: ${error.message}`,
        },
      ],
      metrics,
    };
  }
}
