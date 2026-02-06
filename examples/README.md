# Example Usage

This folder contains examples of how to use the AI Patch Doctor GitHub Action in your repository.

## Basic Usage

The simplest way to use this action is shown in `workflow-example.yml`:

```yaml
name: AI Doctor

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: michaelaccount2/ai-patch-doctor@v1
```

**That's it!** Copy this to `.github/workflows/ai-doctor.yml` in your repository.

## How It Works

When this workflow runs in your repository:

1. **Checks out your code** - Uses `actions/checkout@v4`
2. **Runs AI Patch Doctor** - The action automatically:
   - Sets up Node.js 20
   - Caches npm packages for speed
   - Runs `npx ai-patch doctor --fix --no-telemetry`
   - Displays the report in workflow logs
3. **Detects AI API issues** - Scans for:
   - Missing retry logic
   - 429 rate limit handling
   - Timeout configuration
   - Streaming problems
   - Cost explosion risks
   - Traceability gaps

## What Users See

When you add this action to your repository, it will:

- ✅ Run on every pull request
- ✅ Run on pushes to main
- ✅ Show issues directly in the workflow log
- ✅ Fail CI if critical issues are found
- ✅ Work immediately without any configuration

## Options

### Enable Telemetry (Optional)

By default, telemetry is disabled. To enable:

```yaml
- uses: michaelaccount2/ai-patch-doctor@v1
  with:
    telemetry: true
```

## Real-World Output

When the action runs, users see output like:

```
Found 61 fixable issues:
  • Streaming safety issues (6)
  • Missing retry logic (23)
  • 429 (2)
  • traceability (16)
  • No timeout configured (8)
  • cost (6)

Applying fixes...
  Applied: 28
  Manual required: 24
```

This example represents exactly how the action executes in someone's GitHub Actions pipeline.
