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
echo "✓ Step 4: Run AI Patch Doctor (all checks)"
echo "=============================================="
echo "   Command: npx -y ai-patch doctor --target=all --share --ci --no-telemetry"
echo ""
echo "🔍 Executing command..."
echo ""

# Run the actual command that the workflow runs
# Note: This will fail with current CLI because it requires API keys
# But we capture the output to show what happens
set +e  # Don't exit on error
OUTPUT=$(npx -y ai-patch doctor --target=all --share --ci --no-telemetry 2>&1)
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
    echo "   All steps executed without errors"
    echo "   Report generated and would be available as artifact"
elif [ $EXIT_CODE -eq 1 ]; then
    echo "⚠️  EXPECTED BEHAVIOR: Issues detected"
    echo "   The workflow would fail the CI check (blocking merge)"
    echo "   This is the intended behavior when AI issues are found"
elif [ $EXIT_CODE -eq 2 ]; then
    echo "❌ CONFIGURATION ERROR: Missing API keys"
    echo "   This is the current limitation of the CLI"
    echo ""
    echo "📝 What happened:"
    echo "   The --ci flag currently requires API keys (OPENAI_API_KEY, etc.)"
    echo "   For true zero-config operation, the CLI needs enhancement"
    echo ""
    echo "🔧 Expected behavior (with CLI enhancement):"
    echo "   1. Detect no API keys present"
    echo "   2. Automatically fallback to scan-only mode"
    echo "   3. Run static code analysis (like --fix flag does)"
    echo "   4. Generate report.md and report.json"
    echo "   5. Exit with code 0 (pass) or 1 (issues found)"
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
echo "BONUS: Demonstrating expected behavior"
echo "=============================================="
echo ""
echo "Running with --fix flag (scan-only mode that works):"
echo ""

# Save original directory
ORIG_DIR="$(pwd)"

# Create another test directory
TEST_DIR2="/tmp/test-ai-doctor-scan-$$"
SCRIPT_DIR="$ORIG_DIR"
mkdir -p "$TEST_DIR2"

# Go back to script directory to copy files
cd "$SCRIPT_DIR"
cp -r test-codebase/* "$TEST_DIR2/" 2>/dev/null || {
    echo "Note: Already cleaned up test directory"
    echo ""
    echo "To see the expected behavior manually, run:"
    echo "  cd test-codebase && npx -y ai-patch doctor --fix --no-telemetry"
    echo ""
    exit 0
}

cd "$TEST_DIR2"

echo "Command: npx -y ai-patch doctor --fix --no-telemetry"
echo ""

# Run with --fix to show what scan-only mode should do
set +e
SCAN_OUTPUT=$(npx -y ai-patch doctor --fix --no-telemetry 2>&1 | head -80)
SCAN_EXIT=$?
set -e

echo "$SCAN_OUTPUT"
echo ""
echo "Exit code: $SCAN_EXIT"
echo ""

if [ $SCAN_EXIT -eq 0 ]; then
    echo "✅ This is what --ci SHOULD do when no API keys present:"
    echo "   - Scan code statically ✓"
    echo "   - Detect issues ✓"
    echo "   - Exit with appropriate code ✓"
    echo ""
    echo "With this behavior, the workflow would be truly zero-config!"
fi

cd "$SCRIPT_DIR"
rm -rf "$TEST_DIR2"

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
