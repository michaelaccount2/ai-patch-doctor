# AI Patch Doctor 🔍⚕️

**For Python developers integrating LLM APIs**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

This is for when your OpenAI/Claude/Gemini code has problems and you want them fixed automatically.

## Installation and running

```bash
pipx run ai-patch doctor --fix
```

Or install it first:
```bash
pip install ai-patch
ai-patch doctor --fix
```

## What happens

The tool walks through your `.py` files, finds API calls with issues (missing timeouts, broken retry logic, no token caps), and rewrites those specific lines.

## Two modes

**Mode 1:** Static code analysis (`--fix` flag)
- Reads your Python files
- Finds problematic patterns
- Rewrites them
- Validates syntax

**Mode 2:** Live API testing (default)
- Makes real API calls
- Measures performance
- Reports problems

## Options

```bash
--fix          # Modify your files
--dry-run      # Show planned changes only
--ci           # Silent mode for automation
--no-telemetry # Skip analytics
```

Full documentation at: [github.com/michaelaccount2/ai-patch-doctor](https://github.com/michaelaccount2/ai-patch-doctor)

MIT License

---

**Cleaner API code with less work.**
