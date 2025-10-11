#!/bin/bash

# FlowSubs Demo Data Test Runner
# Runs comprehensive tests for FlowSubs demo data functionality

set -e

echo "🧪 FlowSubs Demo Data Test Suite"
echo "================================"
echo ""

# Configuration
CONTRACT_ADDRESS="0xYOUR_CONTRACT_ADDRESS"  # Replace with your deployed contract address
NETWORK="testnet"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}Running: $test_name${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Check prerequisites
echo "🔍 Checking Prerequisites..."
echo "============================"

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo -e "${RED}❌ Flow CLI is not installed${NC}"
    echo "Please install Flow CLI: https://docs.onflow.org/cli/install/"
    exit 1
fi
echo -e "${GREEN}✅ Flow CLI found${NC}"

# Check if Node.js is installed (for JS tests)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found - skipping JavaScript tests${NC}"
    SKIP_JS_TESTS=true
else
    echo -e "${GREEN}✅ Node.js found${NC}"
    SKIP_JS_TESTS=false
fi

# Check if Jest is available (for JS tests)
if [ "$SKIP_JS_TESTS" = false ]; then
    if ! command -v npx &> /dev/null || ! npx jest --version &> /dev/null; then
        echo -e "${YELLOW}⚠️  Jest not found - skipping JavaScript tests${NC}"
        SKIP_JS_TESTS=true
    else
        echo -e "${GREEN}✅ Jest found${NC}"
    fi
fi

echo ""

# Update contract addresses in test files
echo "🔧 Updating contract addresses..."
if [ -f "tests/FlowSubs_DemoData_test.cdc" ]; then
    sed -i "s/0xYOUR_CONTRACT_ADDRESS/$CONTRACT_ADDRESS/g" "tests/FlowSubs_DemoData_test.cdc"
    echo -e "${GREEN}✅ Updated Cadence test file${NC}"
fi

echo ""

# Run Cadence Tests
echo "📝 Running Cadence Tests..."
echo "============================"

# Test 1: Contract Deployment
run_test "Contract Deployment Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testContractDeployment"

# Test 2: Provider Registration
run_test "Provider Registration Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testProviderRegistration"

# Test 3: Subscription Creation
run_test "Subscription Creation Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionCreation"

# Test 4: Invalid Subscription Amounts
run_test "Invalid Subscription Amounts Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testInvalidSubscriptionAmounts"

# Test 5: Duplicate Subscriptions
run_test "Duplicate Subscriptions Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testDuplicateSubscriptions"

# Test 6: Demo Data Structure
run_test "Demo Data Structure Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testDemoDataStructure"

# Test 7: Subscription Events
run_test "Subscription Events Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionEvents"

# Test 8: Query Functions
run_test "Query Functions Test" "flow test tests/FlowSubs_DemoData_test.cdc --test testQueryFunctions"

# Run JavaScript Tests (if available)
if [ "$SKIP_JS_TESTS" = false ]; then
    echo "📝 Running JavaScript Tests..."
    echo "=============================="
    
    # Test 9: Demo Data Generation
    run_test "Demo Data Generation Test" "node tests/FlowSubs_DemoData_test.js"
    
    # Test 10: Jest Tests (if available)
    if command -v npx &> /dev/null && npx jest --version &> /dev/null; then
        run_test "Jest Unit Tests" "npx jest tests/FlowSubs_DemoData_test.js --verbose"
    fi
fi

# Run Integration Tests
echo "🔗 Running Integration Tests..."
echo "==============================="

# Test 11: Demo Data Script Execution
if [ -f "scripts/demo-data-generator.js" ]; then
    run_test "Demo Data Generator Script" "node scripts/demo-data-generator.js"
fi

# Test 12: Contract Address Validation
run_test "Contract Address Validation" "[[ '$CONTRACT_ADDRESS' != '0xYOUR_CONTRACT_ADDRESS' ]]"

# Test 13: File Structure Validation
run_test "Required Files Exist" "[[ -f 'contracts/FlowSubs.cdc' && -f 'transactions/setup_demo_data.cdc' && -f 'scripts/setup_demo_data.sh' ]]"

# Test 14: Transaction File Syntax
if [ -f "transactions/register_demo_provider.cdc" ]; then
    run_test "Provider Registration Transaction Syntax" "flow transactions build transactions/register_demo_provider.cdc --dry-run"
fi

if [ -f "transactions/create_demo_subscription.cdc" ]; then
    run_test "Subscription Creation Transaction Syntax" "flow transactions build transactions/create_demo_subscription.cdc --dry-run"
fi

# Test 15: Script File Syntax
if [ -f "scripts/get_demo_data.cdc" ]; then
    run_test "Demo Data Query Script Syntax" "flow scripts build scripts/get_demo_data.cdc --dry-run"
fi

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "✅ FlowSubs demo data is ready for deployment and testing"
    echo ""
    echo "Next steps:"
    echo "1. Deploy your contract to Flow testnet"
    echo "2. Update contract address in all files"
    echo "3. Run the demo data setup script"
    echo "4. Test with your frontend application"
    echo ""
    echo "Commands to run:"
    echo "  flow contracts deploy contracts/FlowSubs.cdc --network testnet"
    echo "  ./scripts/setup_demo_data.sh"
    echo "  flow scripts execute scripts/get_demo_data.cdc --network testnet"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "Please review the failed tests and fix any issues before proceeding."
    echo ""
    echo "Common issues:"
    echo "• Contract address not updated (replace 0xYOUR_CONTRACT_ADDRESS)"
    echo "• Flow CLI not properly installed"
    echo "• Missing dependencies (Node.js, Jest)"
    echo "• Syntax errors in Cadence files"
    exit 1
fi
