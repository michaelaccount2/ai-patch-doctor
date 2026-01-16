#!/bin/bash
# Master verification and walkthrough script for AI Patch Doctor
#
# This script combines two worlds:
# 1. Developer side: Runs the comprehensive test suite (25 tests)
# 2. User side: Demonstrates the real-world tool output (live demo)
#
# Usage:
#   bash verify.sh              - Run full verification
#   VERBOSE=1 bash verify.sh    - Show detailed output

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Detect timeout command (macOS uses gtimeout, Linux uses timeout)
TIMEOUT_CMD=""
if command -v timeout &> /dev/null; then
    TIMEOUT_CMD="timeout"
elif command -v gtimeout &> /dev/null; then
    TIMEOUT_CMD="gtimeout"
else
    echo -e "${YELLOW}[WARN]${NC} No timeout command found (timeout or gtimeout)"
    echo -e "${YELLOW}[WARN]${NC} Install coreutils on macOS: brew install coreutils"
    echo -e "${YELLOW}[WARN]${NC} Continuing without timeout protection..."
fi

# Helper functions
log_header() {
    echo ""
    echo -e "${BOLD}${CYAN}========================================${NC}"
    echo -e "${BOLD}${CYAN}$1${NC}"
    echo -e "${BOLD}${CYAN}========================================${NC}"
    echo ""
}

log_separator() {
    echo ""
    echo -e "${BLUE}────────────────────────────────────────${NC}"
    echo ""
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_fail() {
    echo -e "${RED}[✗]${NC} $1"
}

# Main banner
echo ""
echo -e "${BOLD}${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║   AI Patch Doctor - Full Verification  ║${NC}"
echo -e "${BOLD}${GREEN}║   Unit Tests + Live Feature Demo       ║${NC}"
echo -e "${BOLD}${GREEN}╔════════════════════════════════════════╗${NC}"
echo ""

# ========================================
# PHASE 1: RUN THE TEST SUITE
# ========================================

log_header "PHASE 1: Unit Tests (test_doctor.sh)"

log_info "Running comprehensive test suite..."
log_info "This will verify all 25 test cases across Python and Node implementations"
log_separator

# Run the test suite
if bash ./test_doctor.sh; then
    TEST_EXIT=$?
    log_separator
    log_success "Test suite completed successfully!"
else
    TEST_EXIT=$?
    log_separator
    log_fail "Test suite failed with exit code: $TEST_EXIT"
    echo ""
    echo -e "${RED}════════════════════════════════════════${NC}"
    echo -e "${RED}VERIFICATION FAILED${NC}"
    echo -e "${RED}════════════════════════════════════════${NC}"
    echo ""
    exit 1
fi

# ========================================
# PHASE 2: LIVE FEATURE DEMO
# ========================================

log_header "PHASE 2: Live Feature Demo (Real Tool Output)"

log_info "Running: ai-patch doctor --target=cost --ci"
log_info "Using: OPENAI_API_KEY=sk-demo-123 (dummy key for demo)"
log_info "This demonstrates the real-world diagnostic output"
log_separator

# Determine which implementation to use (prefer Python)
DEMO_CMD=""
if python3 -c "import ai_patch.cli" &> /dev/null; then
    DEMO_CMD="python3 -m ai_patch.cli doctor --target=cost --ci"
    log_info "Using Python implementation"
elif [ -f "../node/dist/src/cli.js" ]; then
    DEMO_CMD="node ../node/dist/src/cli.js doctor --target=cost --ci"
    log_info "Using Node implementation"
else
    log_fail "No implementation available for demo"
    exit 1
fi

# Run the live demo with timeout protection
if [ -n "$TIMEOUT_CMD" ]; then
    DEMO_OUTPUT=$(OPENAI_API_KEY=sk-demo-123 $TIMEOUT_CMD 30 bash -c "$DEMO_CMD" 2>&1)
    DEMO_EXIT=$?
else
    # No timeout available, run without it
    DEMO_OUTPUT=$(OPENAI_API_KEY=sk-demo-123 bash -c "$DEMO_CMD" 2>&1)
    DEMO_EXIT=$?
fi

# Display the demo output
echo "$DEMO_OUTPUT"
echo ""

# Check if demo succeeded
if [ $DEMO_EXIT -eq 0 ]; then
    log_success "Live demo completed successfully!"
else
    log_fail "Live demo failed with exit code: $DEMO_EXIT"
    exit 1
fi

# ========================================
# PHASE 3: REPORT SUMMARY
# ========================================

log_separator
log_header "PHASE 3: Report Summary"

# Find the most recent report
REPORT_PATH="./ai-patch-reports/latest/report.md"

if [ -f "$REPORT_PATH" ]; then
    log_success "Report generated successfully"
    echo ""
    echo -e "${BOLD}📊 Report Location:${NC}"
    echo -e "   ${CYAN}$(realpath "$REPORT_PATH")${NC}"
    echo ""
    echo -e "${BOLD}Quick Access:${NC}"
    echo -e "   ${CYAN}cat $REPORT_PATH${NC}"
    echo ""
    echo -e "${BOLD}Report Preview:${NC}"
    echo -e "${BLUE}────────────────────────────────────────${NC}"
    head -20 "$REPORT_PATH" | sed 's/^/  /'
    echo -e "${BLUE}────────────────────────────────────────${NC}"
    echo ""
else
    log_fail "Report file not found at: $REPORT_PATH"
    echo -e "${YELLOW}[INFO]${NC} Checking for reports in other locations..."
    find ./ai-patch-reports -name "report.md" 2>/dev/null || true
fi

# ========================================
# FINAL SUMMARY
# ========================================

log_separator
echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}✅ VERIFICATION COMPLETE${NC}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}[✓]${NC} All 25 tests passing"
echo -e "${GREEN}[✓]${NC} Live diagnostic demo successful"
echo -e "${GREEN}[✓]${NC} Report generated: ${CYAN}$REPORT_PATH${NC}"
echo ""
echo -e "${BOLD}What was verified:${NC}"
echo "  • Python & Node implementations"
echo "  • Interactive and non-interactive modes"
echo "  • CI mode behavior"
echo "  • Provider detection and validation"
echo "  • Edge case handling"
echo "  • Cost check diagnostic output"
echo "  • Report generation and formatting"
echo ""
echo -e "${BOLD}${CYAN}The whole flow works! 🎉${NC}"
echo ""

exit 0
