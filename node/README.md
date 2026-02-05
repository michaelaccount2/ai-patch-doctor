# AI Patch Doctor 🔍⚕️

**Repository scanner and code patcher for AI API integrations**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-16+-green.svg)](https://nodejs.org/)

Command-line utility that examines your JavaScript, TypeScript, and Python source files for AI API integration flaws, then rewrites problematic code with proper error handling, timeouts, and cost controls. Also performs live health checks against OpenAI, Anthropic Claude, Google Gemini APIs.

## 🚀 Quick Start

```bash
# Analyze and patch your repository
npx ai-patch doctor --fix

# Or install for repeated use
npm install -g ai-patch
ai-patch doctor --fix
```

## ✨ Core Capabilities

- **🔧 Static Code Repair**: Traverses your codebase and modifies problematic API integration patterns
- **4 Specialized Probes**: Streaming, Retry, Cost, and Traceability analysis modules
- **Multi-Provider**: Works with OpenAI, Anthropic, Gemini, plus any OpenAI-compatible endpoint
- **Conversational Testing**: Two-question dialogue for live connection diagnostics
- **Environment Reading**: Pulls API credentials and base URLs from your .env
- **Post-Patch Validation**: Executes smoke tests and optionally your full test suite
- **Structured Output**: Generates both JSON data and markdown documentation

## 🔧 Automated Corrections

The tool can rewrite these patterns without supervision:

- ✅ **No timeout parameter** → Adds `timeout: 60000` (60s guard)
- ✅ **Missing retry mechanism** → Wraps with exponential backoff plus jitter
- ✅ **Linear delay retries** → Replaces with `2^attempt` progression
- ✅ **Unbounded max_tokens** → Inserts `max_tokens: 1000` budget
- ✅ **Excessive token ceiling** → Lowers to sensible threshold
- ✅ **No request correlation** → Injects UUID generation and logging
- ✅ **Buffered streaming** → Adds flush() operations where applicable

## 💻 Command Examples

```bash
# Repository modification mode
ai-patch doctor --fix                 # Scan and apply patches
ai-patch doctor --fix --dry-run       # Preview without writing

# Live diagnostic mode
ai-patch doctor                       # Interactive session
ai-patch doctor --target=streaming    # Test specific subsystem
ai-patch doctor --target=all          # Full diagnostic battery

# Automated pipeline mode
ai-patch doctor --ci                  # Headless operation
ai-patch doctor --fix --ci            # Auto-repair in CI/CD
```

## 📖 Complete Documentation

Detailed guides, examples, and advanced configuration:
- **Source Repository**: [github.com/michaelaccount2/ai-patch-doctor](https://github.com/michaelaccount2/ai-patch-doctor)
- **Bug Reports**: [github.com/michaelaccount2/ai-patch-doctor/issues](https://github.com/michaelaccount2/ai-patch-doctor/issues)

## 🔬 Operation Flow

1. **Discovery**: Walks file tree searching for AI API integration code
2. **Analysis**: Identifies missing safeguards and poor patterns
3. **Modification**: Rewrites problematic lines with better implementations
4. **Validation**: Runs syntax checks and lightweight smoke tests
5. **Documentation**: Produces detailed report of all changes

## 📄 License

MIT License - see [LICENSE](https://github.com/michaelaccount2/ai-patch-doctor/blob/main/LICENSE) file for details.

---

**Point it at your repo. Watch it heal your AI integrations. ⚕️**
