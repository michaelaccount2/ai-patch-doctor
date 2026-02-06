# Using AI Patch Doctor as a GitHub Action

## Quick Start

Add this to your `.github/workflows/ai-doctor.yml`:

```yaml
name: AI Doctor

on:
  pull_request:
  push:
    branches: [ main ]

permissions:
  contents: read

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: michaelaccount2/ai-patch-doctor@v1
```

That's it! The action will:
- ✅ Scan your code for AI API integration issues
- ✅ Detect 429s, retry storms, streaming stalls, timeouts, cost explosions
- ✅ Apply safe automatic fixes
- ✅ Display results in your CI logs
- ✅ Work without any configuration or API keys

## Features

**Zero-Config Operation:**
- No API keys required
- No configuration needed
- Works immediately on any repository

**Detects Critical Issues:**
- 429 rate limit errors without retry logic
- Retry storms (linear retries instead of exponential backoff)
- Streaming stalls (missing SSE headers, buffering issues)
- Timeout issues (missing timeout configuration)
- Cost explosions (unbounded max_tokens)
- Missing request IDs and traceability

**Automatic Fixes:**
- Applies safe fixes where possible
- Reports issues requiring manual intervention
- Provides file:line location and fix suggestions

## Inputs

### `telemetry`

Enable anonymous telemetry (default: `false`).

```yaml
- uses: michaelaccount2/ai-patch-doctor@v1
  with:
    telemetry: true
```

## Example Workflow

```yaml
name: AI Doctor

on:
  pull_request:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  doctor:
    runs-on: ubuntu-latest
    name: Scan for AI API issues
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run AI Patch Doctor
        uses: michaelaccount2/ai-patch-doctor@v1
```

## What It Scans

The action scans your code for common AI API integration issues:

- **Retries**: Unbounded retries, missing max attempts, linear backoff
- **Timeouts**: No timeout set, huge timeouts, missing abort/cancel
- **Streaming**: SSE streams not drained/closed, missing stall timeout
- **Traceability**: Missing request-id propagation/logging
- **Cost**: Unbounded max_tokens, no usage tracking
- **Rate Limits**: 429 errors without retry logic

## Output

Results are displayed directly in your GitHub Actions logs:

```
✓ Found 61 fixable issues:
  • Streaming safety issues (6)
  • Missing retry logic (23)
  • 429 (2)
  • traceability (16)
  • No timeout configured (8)
  • cost (6)

✓ Applied: 28 automatic fixes
⚠️ Manual required: 24 issues
```

## Why This Action?

- **Zero maintenance** - Always uses the latest version
- **No custom setup** - Works immediately without configuration
- **Fails fast** - Catches issues before they hit production
- **Spreads organically** - CI failures drive adoption

## Local Testing

You can also run the tool locally:

```bash
npx ai-patch doctor --fix --no-telemetry
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: https://github.com/michaelaccount2/ai-patch-doctor/issues
- **Documentation**: See [AI-DOCTOR-ACTION.md](AI-DOCTOR-ACTION.md) for detailed usage guide
