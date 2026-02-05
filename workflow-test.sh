#!/bin/bash
# Test the ai-doctor.yml workflow in isolation
# This simulates exactly what happens when the GitHub Action runs

set -e

echo "=============================================="
echo "Testing .github/workflows/ai-doctor.yml"
echo "Simulating GitHub Actions environment"
echo "=============================================="
echo ""

# Create a temporary test repository that mimics a user's repo
TEST_DIR="/tmp/test-ai-doctor-workflow-$$"
echo "📁 Creating test repository: $TEST_DIR"
mkdir -p "$TEST_DIR"

# Copy test-codebase files to simulate a user's repository with AI code
echo "📋 Copying test-codebase files (simulating user's AI code)..."
cp -r "$(dirname "$0")/test-codebase"/* "$TEST_DIR/"
cd "$TEST_DIR"
echo "   Working directory: $(pwd)"
echo ""

# Step 1: Checkout code (simulated - we already copied the files)
echo "✓ Step 1: Checkout code"
echo "   Action: uses: actions/checkout@v4"
echo "   Status: ✓ Complete (simulated)"
echo ""

# Step 2: Setup Node.js
echo "✓ Step 2: Setup Node.js"
echo "   Action: uses: actions/setup-node@v4"
echo "   Node version required: 20"
CURRENT_NODE=$(node -v 2>/dev/null || echo "not installed")
echo "   Current Node version: $CURRENT_NODE"
if ! command -v node &> /dev/null; then
    echo "   ❌ ERROR: Node.js not installed"
    echo "   Install Node.js 20+ to run this test"
    exit 1
fi
echo "   Status: ✓ Complete"
echo ""

# Step 3: Cache npm (simulated)
echo "✓ Step 3: Cache npm"
echo "   Action: uses: actions/cache@v4"
echo "   Cache path: ~/.npm"
echo "   Status: ✓ Complete (simulated)"
echo ""

# Step 4: Run AI Patch Doctor
echo "=============================================="
echo "✓ Step 4: Run AI Patch Doctor (scan for issues)"
echo "=============================================="
echo "   Command: npx -y ai-patch doctor --fix --no-telemetry"
echo ""
echo "🔍 Executing command..."
echo ""

# Run the actual command that the workflow runs
set +e  # Don't exit on error
OUTPUT=$(npx -y ai-patch doctor --fix --no-telemetry 2>&1)
EXIT_CODE=$?
set -e

echo "$OUTPUT"
echo ""
echo "   Exit code: $EXIT_CODE"
echo ""

# Step 5: Display report in logs
echo "=============================================="
echo "✓ Step 5: Display report in logs"
echo "=============================================="
echo "   Condition: if: always()"
echo ""

if [ -f report.md ]; then
    echo "## AI Patch Doctor Report"
    cat report.md
    echo ""
else
    echo "⚠️ No report.md generated - doctor command may have failed or exited early"
    echo ""
fi

# Step 6: Upload report artifact (simulated)
echo "=============================================="
echo "✓ Step 6: Upload report artifact"
echo "=============================================="
echo "   Action: uses: actions/upload-artifact@v4"
echo "   Artifact name: ai-doctor-report"
echo "   Files to upload:"
if [ -f report.md ]; then
    echo "     - report.md ✓"
else
    echo "     - report.md ✗ (not found)"
fi
if [ -f report.json ]; then
    echo "     - report.json ✓"
else
    echo "     - report.json ✗ (not found)"
fi
echo "   Status: ✓ Complete (simulated)"
echo ""

# Summary
echo "=============================================="
echo "Test Summary"
echo "=============================================="
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ SUCCESS: Workflow completed successfully"
    echo "   Static code scan completed without errors"
    echo "   Issues detected and fixes applied (or no issues found)"
    echo ""
    echo "   The --fix flag:"
    echo "   - Scans code without requiring API keys ✓"
    echo "   - Detects AI API integration issues ✓"
    echo "   - Applies safe automatic fixes ✓"
    echo "   - Exit code 0 indicates success"
elif [ $EXIT_CODE -eq 1 ]; then
    echo "⚠️  EXPECTED BEHAVIOR: Issues detected"
    echo "   The workflow would fail the CI check (blocking merge)"
    echo "   This is the intended behavior when AI issues are found"
elif [ $EXIT_CODE -eq 2 ]; then
    echo "❌ CONFIGURATION ERROR: Should not happen with --fix flag"
    echo "   The --fix flag is supposed to work without API keys"
else
    echo "❌ UNEXPECTED ERROR: Exit code $EXIT_CODE"
    echo "   Something unexpected happened"
fi

echo ""
echo "=============================================="
echo "What users would see in GitHub Actions"
echo "=============================================="
echo ""
echo "In the GitHub Actions UI, users would see:"
echo ""
echo "1. ✓ Checkout code - green checkmark"
echo "2. ✓ Setup Node.js - green checkmark"
echo "3. ✓ Cache npm - green checkmark"
if [ $EXIT_CODE -eq 0 ]; then
    echo "4. ✓ Run AI Patch Doctor - green checkmark"
    echo "5. ✓ Display report in logs - green checkmark"
    echo "6. ✓ Upload report artifact - green checkmark"
    echo ""
    echo "PR Status: ✅ All checks passed"
elif [ $EXIT_CODE -eq 1 ]; then
    echo "4. ❌ Run AI Patch Doctor - red X (issues found)"
    echo "5. ✓ Display report in logs - green checkmark (runs anyway)"
    echo "6. ✓ Upload report artifact - green checkmark (runs anyway)"
    echo ""
    echo "PR Status: ❌ Checks failed - AI issues detected"
    echo "Users can:"
    echo "  - View the report in the logs"
    echo "  - Download the artifact for detailed analysis"
    echo "  - Fix the issues and push again"
else
    echo "4. ❌ Run AI Patch Doctor - red X (configuration error)"
    echo "5. ✓ Display report in logs - green checkmark (runs anyway)"
    echo "6. ✓ Upload report artifact - green checkmark (runs anyway)"
    echo ""
    echo "PR Status: ❌ Checks failed - configuration issue"
fi

echo ""
echo "=============================================="
echo "Understanding the --fix flag"
echo "=============================================="
echo ""
echo "The --fix flag name is historical - it was originally designed to"
echo "apply automatic fixes to detected issues. However, it also serves"
echo "as the scan-only mode that works without API keys."
echo ""
echo "What --fix does:"
echo "  1. Scans code statically (no API calls)"
echo "  2. Detects AI API integration issues"
echo "  3. Applies safe automatic fixes where possible"
echo "  4. Reports issues that require manual fixes"
echo "  5. Works without any configuration or API keys"
echo ""
echo "This makes it perfect for CI/CD pipelines where you want to:"
echo "  - Detect issues early (in PRs)"
echo "  - Fail builds when problems are found"
echo "  - Provide actionable feedback to developers"
echo ""
echo "=============================================="
echo "To test with working static scan:"
echo "=============================================="
echo ""
echo "Run this command instead (uses --fix flag):"
echo "  cd $TEST_DIR"
echo "  npx -y ai-patch doctor --fix --no-telemetry"
echo ""
echo "This demonstrates what the workflow SHOULD do:"
echo "  - Scan code without API keys"
echo "  - Detect AI API integration issues"
echo "  - Generate actionable report"
echo ""

# Cleanup
cd - > /dev/null
echo "🧹 Cleaning up test directory: $TEST_DIR"
rm -rf "$TEST_DIR"
echo ""
echo "✅ Test complete!"
