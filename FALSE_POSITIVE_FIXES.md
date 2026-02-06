# False Positive Fixes - Summary

## Changes Made

### 1. Build Artifact Exclusion
**File:** `node/scanner.ts`
- Added `.next` to the `excludeDirs` list (line 64)
- This prevents scanning of Next.js build artifacts

### 2. Context-Aware Scanning
**File:** `node/scanner.ts`
- Added `isLikelyInString()` helper function (lines 17-69)
- Added `isActualCode()` helper function (line 72-75)
- These functions detect if a keyword appears in:
  - String literals (single, double, or backtick quotes)
  - Template strings
  - Comments (// or # or *)
  - JSX text nodes
  - URLs

### 3. Python Timeout Interpretation
**File:** `node/scanner.ts`, `checkTimeoutIssues()` function
- Added file extension check: `const isPython = file.endsWith('.py')`
- Different thresholds for Python (seconds) vs JS/TS (milliseconds)
  - Python: < 10 seconds is too low
  - JS/TS: < 10000 milliseconds is too low
- Correct unit display in messages (s for Python, ms for JS/TS)
- Changed to check ALL timeout lines, not just the first one

### 4. Updated Check Functions
**Files:** `node/scanner.ts`
- `checkRetryIssues()`: Now filters lines with `isActualCode(line, 'retry')`
- `checkTimeoutIssues()`: Now filters lines with `isActualCode(line, 'timeout')`
- `checkCostIssues()`: Now filters lines with `isActualCode(line, 'max_tokens')`

## Fixed False Positives

### Before
❌ Line with `const title = "Linear retry detected"` → Flagged as retry code
❌ Line with ``const url = `https://api.openai.com/v1/chat/completions` `` → Flagged for timeout
❌ Line with `timeout=60` in Python → Flagged as "60ms is too low"
❌ Files in `.next/` directory → Scanned and flagged

### After
✅ String literals with keywords → Not flagged
✅ Template strings with URLs → Not flagged  
✅ Python `timeout=60` → Recognized as 60 seconds (not flagged)
✅ Python `timeout=5` → Correctly flagged as 5 seconds (too low)
✅ JSX display code → Not flagged
✅ `.next/` build artifacts → Not scanned

## Test Results

Created comprehensive validation test suite (`test-false-positives.js`):
- ✅ All 6 validation checks pass
- ✅ 116 of 117 existing tests pass (1 pre-existing failure in README test)

### Validation Test Coverage
1. String literals with keywords not flagged
2. Template strings with URLs not flagged
3. Python timeout=60 not flagged (correct interpretation)
4. Python timeout=5 correctly flagged (too low)
5. JSX display code not flagged
6. Build artifacts (.next) excluded from scanning

## Usage

Run the validation tests:
```bash
cd /home/runner/work/ai-patch-doctor/ai-patch-doctor
node test-false-positives.js
```

Expected output:
```
✅ ALL VALIDATION TESTS PASSED
```
