# 🥇 AI Patch Doctor - Complete Guide

> **Run the doctor. Fix your AI API.**

**Version:** 1.0.0  
**Last Updated:** 2026-01-14

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Architecture](#architecture)
5. [The Doctor Command](#the-doctor-command)
6. [Commands Reference](#commands-reference)
7. [The 4 Wedge Checks](#the-4-wedge-checks)
8. [Provider Support](#provider-support)
9. [Report Generation](#report-generation)
10. [Testing & Validation](#testing--validation)
11. [Publishing](#publishing)
12. [Deployment](#deployment)
13. [Launch Guide](#launch-guide)
14. [API Reference](#api-reference)
15. [Troubleshooting](#troubleshooting)

---

## Overview

**AI Patch Doctor** is a dual-language (Python + Node) CLI tool that diagnoses and fixes AI API issues.

```bash
# Python
pipx run ai-patch doctor

# Node
npx ai-patch doctor
```

**That's it. Run the doctor, fix your AI API.**

### Why "doctor"?

Same mental model as `brew doctor`, `kubectl doctor`, `terraform plan`:
- "Run the doctor"
- "Doctor found an issue"  
- "Doctor can fix this"

**You don't brand the company "AI Doctor" — you expose a doctor command.**

### Key Features

- ✅ **4 Wedge Checks**: streaming, retries, cost, traceability
- ✅ **Dual Language**: Python and Node with identical UX
- ✅ **Shared Code**: Zero duplication, single source of truth
- ✅ **Interactive Mode**: 2-question flow, auto-detection
- ✅ **Safe by Default**: Dry-run mode, reversible changes
- ✅ **Growth Optimized**: Share bundles, escalation paths

---

## Quick Start

### Python

```bash
# Install
pipx install ai-patch

# Run
ai-patch doctor
```

### Node

```bash
# Run (no install needed)
npx ai-patch doctor

# Or install globally
npm install -g ai-patch
ai-patch doctor
```

### First Run

1. Run `ai-patch doctor`
2. Answer 2 questions:
   - What's failing? (streaming/retries/cost/trace)
   - What provider? (OpenAI/Anthropic/Gemini)
3. Get diagnosis in < 60s
4. Review report in `./ai-patch-reports/`
5. Apply fixes with `ai-patch apply --safe`

---

## Installation

### Python (PyPI)

**Requirements**: Python 3.8+

```bash
# Using pipx (recommended)
pipx install ai-patch

# Using pip
pip install ai-patch

# From source
git clone https://github.com/yourusername/ai-patch
cd ai-patch/python
pip install -e .
```

### Node (npm)

**Requirements**: Node 14+

```bash
# Global install
npm install -g ai-patch

# Local install
npm install ai-patch

# Using npx (no install)
npx ai-patch

# From source
git clone https://github.com/yourusername/ai-patch
cd ai-patch/node
npm install && npm run build
```

---

## Architecture

### Code Structure

```
ai-patch-shared/              # Shared code (~3000 LOC)
├── python/
│   ├── checks/              # 4 wedge checks
│   │   ├── streaming.py     # SSE stalls, chunk gaps, TTFB
│   │   ├── retries.py       # 429s, Retry-After, backoff
│   │   ├── cost.py          # Token limits, cost spikes
│   │   └── trace.py         # Request IDs, correlation
│   ├── config.py            # Environment detection
│   └── report.py            # Report generation
├── node/
│   ├── checks/              # 4 wedge checks (TypeScript)
│   │   ├── streaming.ts
│   │   ├── retries.ts
│   │   ├── cost.ts
│   │   └── trace.ts
│   ├── config.ts            # Environment detection
│   └── report.ts            # Report generation
└── report-schema.json       # Shared schema

ai-patch/                     # CLI wrappers (~500 LOC)
├── python/
│   └── src/ai_patch/
│       ├── cli.py           # Imports from ai-patch-shared
│       └── __main__.py      # Entry point
└── node/
    └── src/
        └── cli.ts           # Imports from ai-patch-shared
```

### Design Principles

1. **Shared Code**: All logic in `ai-patch-shared/`. CLIs are thin wrappers.
2. **Zero Duplication**: No duplicate code between Python and Node.
3. **Identical UX**: Same commands, same output, same behavior.
4. **Safe by Default**: Dry-run first, explicit confirmation for changes.
5. **Growth Optimized**: Built-in sharing and escalation paths.

---

## The Doctor Command

**Interactive diagnosis in < 60 seconds**

### What It Does

1. **Intake** (2 questions):
   - What's failing? (streaming/retries/cost/trace/all)
   - What provider? (OpenAI/Anthropic/Gemini/gateway)

2. **Detection**:
   - Auto-detect environment variables
   - Scan for SDK usage
   - Identify configuration issues

3. **Checks** (4 wedges):
   - Run targeted diagnostics
   - Collect metrics and evidence
   - Generate findings with severity

4. **Report**:
   - Generate JSON + Markdown
   - Save to `./ai-patch-reports/<timestamp>/`
   - Display summary in terminal

5. **Suggest**:
   - Propose fixes (dry-run)
   - Explain rationale
   - Show command to apply

### Example Session

```bash
$ ai-patch doctor

🔍 AI Patch Doctor - Interactive Mode

What's failing?
  1. streaming / SSE stalls / partial output
  2. retries / 429 / rate-limit chaos
  3. cost spikes
  4. traceability (request IDs, duplicates)
  5. prod-only issues (all checks)
Select: 1

What do you use?
  1. OpenAI-compatible (default)
  2. Anthropic
  3. Gemini
Select: 1

🔍 Running checks...
  ✓ Environment detection
  ✓ Streaming check
  ⚠️ Found 2 issues

📊 Report generated: ./ai-patch-reports/2026-01-14-123456/

⚠️ Issues Found:
  1. SSE buffering detected (nginx proxy)
  2. Missing X-Accel-Buffering header

💡 Suggested Fix:
  Add X-Accel-Buffering: no to proxy config

Run: ai-patch apply --safe
```

---

## Commands Reference

### `ai-patch doctor`

**Default command** - Interactive diagnosis

```bash
ai-patch doctor                    # Interactive mode
ai-patch doctor --target=streaming # Specific check
ai-patch doctor --target=all       # All checks
```

**Options**:
- `--target <type>`: Specific target (streaming/retries/cost/trace/all)
- `--provider <name>`: Provider (openai/anthropic/gemini)
- `--dry-run`: Don't make any changes (default)

### `ai-patch apply`

Apply suggested fixes

```bash
ai-patch apply --safe              # Apply with confirmation
ai-patch apply --auto              # Apply without confirmation (dangerous)
```

**Options**:
- `--safe`: Require confirmation for each change
- `--auto`: Apply all changes without confirmation
- `--backup`: Create backup before applying (default: true)

### `ai-patch test`

Test applied fixes

```bash
ai-patch test                      # Test last applied fixes
ai-patch test --target=streaming   # Test specific area
```

### `ai-patch share`

Share report (redacted)

```bash
ai-patch share --redact            # Create redacted share bundle
ai-patch share --full              # Include full details (be careful!)
```

Creates a shareable bundle:
- `report.md` (redacted)
- `report.json` (redacted)
- `repro.sh` (optional)

### `ai-patch revert`

Undo applied changes

```bash
ai-patch revert                    # Revert last changes
ai-patch revert --all              # Revert all changes
```

---

## The 4 Wedge Checks

### 1. Streaming Check

**Diagnoses**: SSE stalls, partial output, chunk gaps

**Checks for**:
- SSE framing issues
- Time to first byte (TTFB) > 5s
- Chunk gaps > 2s
- Proxy buffering (nginx, envoy)
- Client read timeouts
- gzip/compression issues

**Example finding**:
```
⚠️ SSE Buffering Detected
Severity: High
Evidence: X-Accel-Buffering header missing
Impact: Streaming stalls after 30s
Fix: Add X-Accel-Buffering: no to nginx config
```

### 2. Retries Check

**Diagnoses**: 429s, rate limit chaos, retry storms

**Checks for**:
- Retry-After header respect
- Exponential backoff implementation
- Retry cap (max 3 recommended)
- Mid-stream retry (dangerous!)
- Concurrent request limits

**Example finding**:
```
❌ Mid-Stream Retry Detected
Severity: Critical
Evidence: Retry after stream started
Impact: Duplicate charges, inconsistent state
Fix: Never retry once stream has started
```

### 3. Cost Check

**Diagnoses**: Token spikes, runaway costs

**Checks for**:
- Prompt size limits
- max_tokens sanity (< 4096 recommended)
- Token/cost estimation
- Loop detection (tool/function loops)
- Missing cost guardrails

**Example finding**:
```
⚠️ No Max Tokens Cap
Severity: Medium
Evidence: max_tokens not set
Impact: Unbounded token usage
Fix: Set max_tokens=2048 for safety
```

### 4. Traceability Check

**Diagnoses**: Missing request IDs, duplicate requests

**Checks for**:
- Stable request ID generation
- Duplicate request detection
- Provider request ID capture
- Correlation ID propagation
- Request logging

**Example finding**:
```
⚠️ Missing Request IDs
Severity: Medium
Evidence: No idempotency-key header
Impact: Can't track duplicate requests
Fix: Add idempotency-key to all requests
```

---

## Provider Support

### OpenAI-Compatible (Default)

Works with:
- OpenAI API
- Azure OpenAI
- Together AI
- Anyscale
- Fireworks AI
- OpenRouter
- Any OpenAI-compatible gateway

**Auto-detected** from `OPENAI_BASE_URL` and `OPENAI_API_KEY`

### Anthropic

Direct support for Claude API

**Auto-detected** from `ANTHROPIC_API_KEY`

### Gemini

Direct support for Gemini API

**Auto-detected** from `GEMINI_API_KEY`

### Gateways

**Supported**:
- LiteLLM
- Portkey
- Helicone
- Custom OpenAI-compatible proxies

**Note**: AI Patch works WITH gateways. It's not a gateway itself.

---

## Report Generation

### Output Format

Every run generates two files in `./ai-patch-reports/<timestamp>/`:

1. **report.json** - Machine-readable
2. **report.md** - Human-readable

### Report Schema

```json
{
  "timestamp": "2026-01-14T12:34:56Z",
  "version": "1.0.0",
  "target": "streaming",
  "provider": "openai",
  "checks": {
    "streaming": {
      "status": "warn",
      "findings": [
        {
          "severity": "high",
          "message": "SSE buffering detected",
          "details": {...},
          "fix": "Add X-Accel-Buffering: no"
        }
      ],
      "metrics": {
        "ttfb_ms": 5234,
        "max_chunk_gap_ms": 2100
      }
    }
  },
  "summary": {
    "status": "warn",
    "findings_count": 2,
    "critical": 0,
    "high": 2,
    "medium": 0
  }
}
```

### Growth Mechanics

Every report includes:

**Footer** (report.md):
```
---
Generated by AI Patch — re-run: npx ai-patch / pipx run ai-patch
```

**Share Bundle** (`ai-patch share --redact`):
- Redacted report (keys/URLs removed)
- Optional repro script
- One-line escalation: "Send to support@aibadgr.com for pilot"

---

## Testing & Validation

### Python Tests

```bash
cd ai-patch/python
pip install -e .[dev]
pytest
```

**Coverage**: 4/4 tests passing
- Config auto-detection
- Report generation
- Check module imports
- Config validation

### Node Tests

```bash
cd ai-patch/node
npm install
npm test
```

**Coverage**: Structure validated
- TypeScript compilation
- Import resolution
- CLI execution

### Comprehensive Jest Tests

```bash
npm install
npm test
```

**Test file**: `ai-patch.test.js`

**Coverage** (15+ tests):
- ✅ Shared code structure
- ✅ Python imports from shared
- ✅ Node imports from shared
- ✅ 4 wedge check modules
- ✅ Config modules
- ✅ Report generators
- ✅ Package structures
- ✅ Command consistency
- ✅ No code duplication

### Validation Script

```bash
python ai-patch/validate.py
```

**Checks** (4/4):
- Report schema validation
- Python package structure
- Node package structure
- Command consistency

---

## Publishing

### Python (PyPI)

**Prerequisites**:
- PyPI account
- twine installed: `pip install twine`

**Build**:
```bash
cd ai-patch/python
python -m build
```

**Test Upload** (TestPyPI):
```bash
twine upload --repository testpypi dist/*
```

**Production Upload**:
```bash
twine upload dist/*
```

**Verify**:
```bash
pipx install ai-patch
ai-patch doctor
```

### Node (npm)

**Prerequisites**:
- npm account
- Logged in: `npm login`

**Build**:
```bash
cd ai-patch/node
npm run build
```

**Test**:
```bash
npm pack
npm install -g ai-patch-0.1.0.tgz
ai-patch doctor
```

**Publish**:
```bash
npm publish
```

**Verify**:
```bash
npx ai-patch doctor
```

---

## Deployment

### Extracting to Open Source Repository

AI Patch Doctor is designed to be extracted from this repository and deployed as a standalone open source project.

**See `DEPLOYMENT_GUIDE.md` for complete instructions on:**

- Extracting AI Patch files to a new public repository
- Maintaining IP separation from AI Badgr (private)
- Verification steps to ensure no proprietary code leaks
- Publishing to npm and PyPI
- Monorepo vs separate repository options

**Quick extraction:**

```bash
# Files to extract (no AI Badgr IP):
- ai-patch/                    # CLI wrappers
- ai-patch-shared/             # Shared code (3000 LOC)
- AI_PATCH_DOCTOR_COMPLETE.md  # Documentation
- ai-patch.test.js             # Jest tests
- package.json                 # Dependencies
```

**IP Separation:**
- ✅ AI Patch Doctor = Open Source (MIT)
- 🔒 AI Badgr = Private (proprietary)

**See DEPLOYMENT_GUIDE.md for detailed extraction scripts and deployment workflows.**

---

## Launch Guide

### Pre-Launch Checklist

- [ ] All tests passing (4/4 Python + 15+ Jest)
- [ ] Python package builds
- [ ] Node package builds
- [ ] Documentation complete
- [ ] PyPI account ready
- [ ] npm account ready
- [ ] Social accounts ready

### Publishing Steps

**Day 1: Publish Packages**

1. **Python**:
   ```bash
   cd ai-patch/python
   python -m build
   twine upload dist/*
   ```

2. **Node**:
   ```bash
   cd ai-patch/node
   npm run build
   npm publish
   ```

3. **Verify**:
   ```bash
   pipx install ai-patch && ai-patch doctor
   npx ai-patch doctor
   ```

**Day 2: Announce**

### Distribution Channels

#### 1. Hacker News

**Title**: Show HN: AI Patch Doctor – CLI tool for diagnosing AI API issues

**Text**:
```
I built AI Patch Doctor - a CLI tool that diagnoses common AI API issues 
in under 60 seconds.

Run `npx ai-patch doctor` (Node) or `pipx run ai-patch doctor` (Python).

It checks 4 areas:
- Streaming (SSE stalls, buffering)
- Retries (429s, rate limits)
- Cost (token spikes, runaway loops)
- Traceability (request IDs, duplicates)

Works with OpenAI, Anthropic, Gemini, and any OpenAI-compatible gateway.

The doctor asks 2 questions, auto-detects your setup, runs checks, and 
generates a report with specific fixes.

Example: if you have SSE buffering, it'll tell you exactly which nginx 
header to add.

All open source, zero external dependencies. Both CLIs import from shared 
code (no duplication).

Would love feedback!

GitHub: [link]
Docs: [link]
```

#### 2. Reddit

**r/MachineLearning**:
```
[P] AI Patch Doctor - CLI for diagnosing AI API issues

Built a developer tool that diagnoses common AI API problems in < 60s.

Checks: streaming stalls, retries/429s, cost spikes, traceability

Works with OpenAI, Anthropic, Gemini, and gateways (LiteLLM, Portkey, etc.)

Python: pipx run ai-patch doctor
Node: npx ai-patch doctor

Open source, dual-language, zero external deps.

GitHub: [link]
```

**r/OpenAI**:
```
Tool: Diagnose OpenAI API issues with `npx ai-patch doctor`

Made a CLI tool for debugging common OpenAI API issues:
- SSE streaming stalls
- Rate limit chaos
- Token/cost spikes
- Missing request IDs

Takes 30 seconds, generates a report with specific fixes.

Also works with Azure OpenAI, Claude, Gemini, and any gateway.

Free, open source, no signup.

Try: npx ai-patch doctor

GitHub: [link]
```

#### 3. Dev.to

**Title**: Introducing AI Patch Doctor: Debug AI APIs in 30 Seconds

**Tags**: #ai #openai #cli #devtools

**Article outline**:
1. The Problem (AI API issues are hard to debug)
2. The Solution (Run the doctor)
3. How It Works (4 wedge checks)
4. Example Session (with terminal output)
5. Installation (Python + Node)
6. Open Source (GitHub link)

#### 4. Twitter/X

**Launch tweet**:
```
🔍 Just shipped AI Patch Doctor

Diagnose AI API issues in 30 seconds:
- Streaming stalls
- Rate limit chaos
- Cost spikes
- Missing traces

Python: pipx run ai-patch doctor
Node: npx ai-patch doctor

Open source, zero deps, works with any provider.

[link]
```

#### 5. Product Hunt

**Tagline**: Debug AI APIs in 30 seconds

**Description**:
```
AI Patch Doctor is a CLI tool that diagnoses common AI API issues 
(streaming, retries, cost, traceability) and suggests specific fixes.

Works with OpenAI, Anthropic, Gemini, and any gateway.

Run the doctor. Fix your API.
```

### First 100 Users Plan

**Week 1: Launch**
- Post on HN, Reddit, Dev.to
- Target: 20 users

**Week 2: Content**
- Write 3 blog posts (use cases)
- Target: 30 users

**Week 3: Community**
- Engage on relevant threads
- Help users debug issues
- Target: 25 users

**Week 4: Iterate**
- Fix bugs, add features
- Collect feedback
- Target: 25 users

**Total**: 100 users in 4 weeks

### Growth Metrics

Track:
1. **Downloads**: PyPI + npm
2. **GitHub Stars**: Organic growth
3. **Share Rate**: % of users who run `ai-patch share`
4. **Retention**: 7-day active users
5. **Feedback**: GitHub issues + discussions

---

## API Reference

### Python API

```python
from ai_patch import Config, ReportGenerator
from ai_patch.checks import streaming, retries, cost, trace

# Create config
config = Config.from_env()

# Run check
result = streaming.check(config)

# Generate report
report = ReportGenerator(config)
report.add_check('streaming', result)
report.save('./output/')
```

### Node API

```typescript
import { Config, ReportGenerator } from 'ai-patch';
import { checkStreaming, checkRetries, checkCost, checkTrace } from 'ai-patch/checks';

// Create config
const config = Config.fromEnv();

// Run check
const result = await checkStreaming(config);

// Generate report
const report = new ReportGenerator(config);
report.addCheck('streaming', result);
await report.save('./output/');
```

---

## Troubleshooting

### Common Issues

#### "Module not found" (Python)

**Problem**: Can't import from ai-patch-shared

**Solution**:
```bash
# Ensure ai-patch-shared is in the path
export PYTHONPATH="${PYTHONPATH}:$(pwd)/ai-patch-shared/python"

# Or install in development mode
cd ai-patch/python
pip install -e .
```

#### "Cannot find module" (Node)

**Problem**: TypeScript can't resolve shared imports

**Solution**:
```bash
# Rebuild
cd ai-patch/node
npm run build

# Check tsconfig paths
# Should have: "baseUrl": ".", "paths": {...}
```

#### "No issues found" but I have problems

**Problem**: Checks not detecting issues

**Solution**:
1. Run with debug: `ai-patch doctor --debug`
2. Check environment variables: `ai-patch config show`
3. Verify provider: `ai-patch test --provider=openai`
4. File an issue on GitHub

#### Tests failing

**Problem**: pytest or npm test fails

**Solution**:
```bash
# Python
pip install -e .[dev]
pytest -v

# Node
npm install
npm test

# Jest
npm install jest @types/jest
npm test
```

### Getting Help

1. **Documentation**: Read this guide
2. **GitHub Issues**: https://github.com/yourusername/ai-patch/issues
3. **Discussions**: https://github.com/yourusername/ai-patch/discussions
4. **Share Bundle**: Run `ai-patch share --redact` and share

---

## Summary

**AI Patch Doctor** is production-ready:

✅ **Code Reuse**: CLIs import from ai-patch-shared (zero duplication)  
✅ **Open Source**: 100% OSS, no proprietary dependencies  
✅ **Tested**: 15+ Jest tests + 4 Python tests  
✅ **Documented**: Single comprehensive guide  
✅ **Launch Ready**: Publishing steps + marketing copy  

**Run the doctor. Fix your AI API.**

```bash
# Python
pipx run ai-patch doctor

# Node
npx ai-patch doctor
```

---

**The doctor will see you now. 🔍**
