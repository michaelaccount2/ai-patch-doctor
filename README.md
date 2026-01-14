# AI Patch Doctor

**The CLI tool that diagnoses and fixes AI API issues**

```bash
# Python
pipx run ai-patch doctor

# Node
npx ai-patch doctor
```

## What is AI Patch Doctor?

AI Patch Doctor is a dual-language (Python + Node.js) CLI tool for diagnosing and fixing AI API issues. It follows the natural CLI mental model of tools like `brew doctor`, `kubectl doctor`, and `terraform plan`.

## Features

- ✅ **4 Wedge Checks**: streaming, retries, cost, traceability
- ✅ **Interactive Doctor**: 2-question flow with auto-detection
- ✅ **Safe by Default**: Dry-run mode, reversible changes
- ✅ **Shared Code Architecture**: Zero duplication between Python and Node
- ✅ **100% Open Source**: No proprietary code, MIT licensed

## Quick Start

### Python

```bash
cd ai-patch/python
pip install -e .
ai-patch doctor
```

### Node

```bash
cd ai-patch/node
npm install
npm run build
npx ai-patch doctor
```

## Documentation

See [AI_PATCH_DOCTOR_COMPLETE.md](./AI_PATCH_DOCTOR_COMPLETE.md) for complete documentation.

## Testing

```bash
npm install
npm test
```

## License

MIT License - See LICENSE file for details.

## About

This is the open source CLI implementation. For the full AI API observability platform with receipts, billing, and hosted compute, see [AI Badgr](https://aibadgr.com).

