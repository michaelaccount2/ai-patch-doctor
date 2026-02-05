# AI Patch Doctor 🔍⚕️

**Catches AI API bugs before they catch you**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-16+-green.svg)](https://nodejs.org/)

This tool does two things: (1) reads your source code to find API integration mistakes, (2) rewrites the bad parts for you.

## For npm users

```bash
npx ai-patch doctor --fix
```

That command scans your repo and patches everything it finds wrong.

## The problems it solves

Your OpenAI/Anthropic/Gemini calls probably have issues:

- Calls hang when APIs are slow (no timeout)
- Retries make rate-limiting worse (wrong algorithm)  
- Bills are unpredictable (no max_tokens)
- Can't debug failures (no request tracking)

This fixes all of that by rewriting your code.

## How to use

Want everything fixed? Run with `--fix`
Want to see plans first? Add `--dry-run`
Want it in CI/CD? Add `--ci`

See the main repo for full docs: [github.com/michaelaccount2/ai-patch-doctor](https://github.com/michaelaccount2/ai-patch-doctor)

MIT License

---

**Better AI code, zero effort.**
