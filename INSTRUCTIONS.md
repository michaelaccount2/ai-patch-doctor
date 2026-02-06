# AI Patch Doctor GitHub Action - Instructions

## What Is This?

This is a **GitHub Action** that scans your code for AI API integration issues. It's a reusable module that developers can drop into their CI pipelines with one line of code.

**Key Features:**
- ✅ Zero-config operation (no API keys needed)
- ✅ Detects 6 categories of AI API issues
- ✅ Works on every PR automatically
- ✅ Provides actionable fix recommendations

**What It Detects:**
- 429 rate limit errors without retry logic
- Retry storms (linear retries instead of exponential backoff)  
- Streaming stalls (missing SSE headers, buffering issues)
- Timeout issues (missing timeout configuration)
- Cost explosions (unbounded max_tokens)
- Missing request IDs and traceability

---

## How to Use This Action

### Quick Start

Add this to your repository's workflow file (e.g., `.github/workflows/ci.yml`):

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  ai-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: michaelaccount2/ai-patch-doctor@v1
```

That's it! The action will now run on every PR and push to main.

### What Happens When It Runs

1. **Setup**: Installs Node.js 20 and caches npm for speed
2. **Scan**: Analyzes your code for AI API integration issues
3. **Report**: Displays findings directly in the GitHub Actions log
4. **Fix**: Applies safe automatic fixes where possible

### Example Output

```
AI Patch Doctor Scan Results
============================

✓ Scanned 12 files
✓ Detected 8 issues
✓ Auto-fixed 3 issues
⚠ 5 issues require manual review

Issues Found:
1. Missing retry logic for 429 errors (file.ts:45)
2. Unbounded max_tokens parameter (api.ts:123)
3. Stream not properly closed (stream.ts:67)
...
```

---

## Testing Locally

Before publishing or to verify the action works, run the test script:

```bash
./test-action.sh
```

This script:
- Creates an isolated test environment
- Runs the action steps locally
- Shows you exactly what users will see
- Cleans up automatically

**Expected output:**
```
✅ SUCCESS: Action works correctly

The action successfully:
  - Scanned code for AI API issues  
  - Applied automatic fixes where possible
  - Generated reports
```

---

## Example Usage

See the `example/` folder for a complete demonstration:

- **`example/workflow.yml`** - Shows how users add this to their pipeline
- **`example/README.md`** - Explains what happens when it runs

The example demonstrates the one-liner usage model that makes GitHub Actions go viral:

```yaml
- uses: michaelaccount2/ai-patch-doctor@v1
```

---

## How to Publish to GitHub Marketplace

### Prerequisites

1. This repository must be public
2. You need owner/admin access to the repository
3. The `action/action.yml` file must exist at the repository root (already done ✓)

### Publishing Steps

1. **Create a Release**
   - Go to: https://github.com/michaelaccount2/ai-patch-doctor/releases/new
   - Tag version: `v1.0.0`
   - Release title: `v1.0.0 - Initial Release`
   - Description: Brief summary of what the action does

2. **Enable Marketplace Publishing**
   - Check the box: "Publish this Action to the GitHub Marketplace"
   - Choose primary category: "Continuous Integration"
   - Add tags: `ai`, `code-quality`, `static-analysis`, `api-integration`

3. **Accept Terms**
   - Review and accept the GitHub Marketplace Developer Agreement
   - Ensure your action follows Marketplace guidelines

4. **Publish**
   - Click "Publish release"
   - Your action is now live on the Marketplace!

### After Publishing

Users can immediately use your action:

```yaml
- uses: michaelaccount2/ai-patch-doctor@v1
```

**Versioning:**
- Major versions: `@v1`, `@v2` (recommended)
- Specific versions: `@v1.0.0`, `@v1.0.1`
- Latest: `@main` (not recommended for users)

---

## Repository Structure

```
ai-patch-doctor/
├── test-action.sh          ← Test the action locally
├── action/                 ← The GitHub Action (ready to publish)
│   └── action.yml          ← Action definition
├── INSTRUCTIONS.md         ← This file
└── example/                ← Usage demonstration
    ├── workflow.yml        ← Example workflow
    └── README.md           ← Explains the example
```

---

## Technical Details

### Action Type

**Composite Action** - Combines multiple steps into a reusable module:

1. Setup Node.js 20
2. Cache npm packages
3. Run `npx -y ai-patch doctor --fix --no-telemetry`
4. Display scan results

### No API Keys Required

The action uses **static code analysis** only. It:
- Scans code patterns (not live API calls)
- Works completely offline
- No credentials needed
- No external API dependencies

### How It Works

The action runs the AI Patch Doctor CLI with the `--fix` flag:

```bash
npx -y ai-patch doctor --fix --no-telemetry
```

This command:
- Downloads the latest CLI version via npx (always up-to-date)
- Scans all code files for AI API patterns
- Detects common integration issues
- Applies safe automatic fixes
- Generates detailed reports

### Exit Codes

- `0` - Success (issues detected and/or fixed)
- Non-zero - Failure (scan errors or critical issues)

---

## Distribution Model

### How This Goes Viral

```
┌─────────────────────────────────┐
│ This repo: The Action           │
│ Published to Marketplace as @v1 │
└─────────────────────────────────┘
              ↓
         referenced by
              ↓
┌─────────────────────────────────┐
│ User repos: Workflows           │  
│ Call Action, run on their PRs   │
└─────────────────────────────────┘
```

**Viral Loop:**
1. Developer adds action to their repo (1 line of code)
2. Action runs on every PR, detects issues
3. CI failures catch attention
4. Team members see the value
5. They add it to their other projects
6. Word spreads organically

**Key Insight:** The action lives in THIS repo. User workflows (in THEIR repos) reference it. That separation is what makes GitHub Actions successful.

---

## Troubleshooting

### Action Not Running

**Problem:** Action doesn't run on PRs

**Solution:** Check your workflow file has correct triggers:
```yaml
on:
  pull_request:
  push:
    branches: [ main ]
```

### Node.js Version Error

**Problem:** Action fails with Node.js version error

**Solution:** The action requires Node.js 20+. This is automatically provided by GitHub Actions runners.

### No Issues Detected

**Problem:** Action runs but reports no issues

**Solution:** This is normal if your code doesn't have AI API integration code, or if all patterns follow best practices.

---

## Support

- **Issues:** https://github.com/michaelaccount2/ai-patch-doctor/issues
- **Discussions:** https://github.com/michaelaccount2/ai-patch-doctor/discussions
- **Marketplace:** https://github.com/marketplace (after publishing)

---

## License

See the LICENSE file in the repository root.

---

## Summary

**To use this action:**
1. Add one line to your workflow: `- uses: michaelaccount2/ai-patch-doctor@v1`
2. It runs automatically on every PR
3. No configuration needed

**To test this action:**
1. Run `./test-action.sh`
2. See exactly what users will experience

**To publish this action:**
1. Create release with tag `v1.0.0`
2. Enable Marketplace publishing
3. Users can immediately use it

**Simple, viral, effective.**
