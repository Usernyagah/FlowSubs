# FlowSubs Demo Data Test Runner for Windows PowerShell
# Runs comprehensive tests for FlowSubs demo data functionality

param(
    [string]$ContractAddress = "0xYOUR_CONTRACT_ADDRESS",
    [string]$Network = "testnet"
)

Write-Host "🧪 FlowSubs Demo Data Test Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test counters
$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

# Function to run a test and track results
function Run-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestCommand
    )
    
    Write-Host "Running: $TestName" -ForegroundColor Blue
    $script:TotalTests++
    
    try {
        $result = & $TestCommand
        if ($LASTEXITCODE -eq 0 -or $result -eq $true) {
            Write-Host "✅ PASSED: $TestName" -ForegroundColor Green
            $script:PassedTests++
        } else {
            Write-Host "❌ FAILED: $TestName" -ForegroundColor Red
            $script:FailedTests++
        }
    } catch {
        Write-Host "❌ FAILED: $TestName" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:FailedTests++
    }
    Write-Host ""
}

# Check prerequisites
Write-Host "🔍 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow

# Check if Flow CLI is installed
try {
    $flowVersion = flow version
    Write-Host "✅ Flow CLI found: $flowVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Flow CLI is not installed" -ForegroundColor Red
    Write-Host "Please install Flow CLI: https://docs.onflow.org/cli/install/" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed (for JS tests)
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    $SkipJsTests = $false
} catch {
    Write-Host "⚠️  Node.js not found - skipping JavaScript tests" -ForegroundColor Yellow
    $SkipJsTests = $true
}

# Check if Jest is available (for JS tests)
if (-not $SkipJsTests) {
    try {
        $jestVersion = npx jest --version
        Write-Host "✅ Jest found: $jestVersion" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Jest not found - skipping JavaScript tests" -ForegroundColor Yellow
        $SkipJsTests = $true
    }
}

Write-Host ""

# Update contract addresses in test files
Write-Host "🔧 Updating contract addresses..." -ForegroundColor Yellow
if (Test-Path "tests/FlowSubs_DemoData_test.cdc") {
    (Get-Content "tests/FlowSubs_DemoData_test.cdc") -replace "0xYOUR_CONTRACT_ADDRESS", $ContractAddress | Set-Content "tests/FlowSubs_DemoData_test.cdc"
    Write-Host "✅ Updated Cadence test file" -ForegroundColor Green
}

Write-Host ""

# Run Cadence Tests
Write-Host "📝 Running Cadence Tests..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Test 1: Contract Deployment
Run-Test "Contract Deployment Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testContractDeployment }

# Test 2: Provider Registration
Run-Test "Provider Registration Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testProviderRegistration }

# Test 3: Subscription Creation
Run-Test "Subscription Creation Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionCreation }

# Test 4: Invalid Subscription Amounts
Run-Test "Invalid Subscription Amounts Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testInvalidSubscriptionAmounts }

# Test 5: Duplicate Subscriptions
Run-Test "Duplicate Subscriptions Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testDuplicateSubscriptions }

# Test 6: Demo Data Structure
Run-Test "Demo Data Structure Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testDemoDataStructure }

# Test 7: Subscription Events
Run-Test "Subscription Events Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionEvents }

# Test 8: Query Functions
Run-Test "Query Functions Test" { flow test tests/FlowSubs_DemoData_test.cdc --test testQueryFunctions }

# Run JavaScript Tests (if available)
if (-not $SkipJsTests) {
    Write-Host "📝 Running JavaScript Tests..." -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    
    # Test 9: Demo Data Generation
    Run-Test "Demo Data Generation Test" { node tests/FlowSubs_DemoData_test.js }
    
    # Test 10: Jest Tests (if available)
    try {
        Run-Test "Jest Unit Tests" { npx jest tests/FlowSubs_DemoData_test.js --verbose }
    } catch {
        Write-Host "⚠️  Jest tests skipped due to configuration issues" -ForegroundColor Yellow
    }
}

# Run Integration Tests
Write-Host "🔗 Running Integration Tests..." -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Test 11: Demo Data Script Execution
if (Test-Path "scripts/demo-data-generator.js") {
    Run-Test "Demo Data Generator Script" { node scripts/demo-data-generator.js }
}

# Test 12: Contract Address Validation
Run-Test "Contract Address Validation" { $ContractAddress -ne "0xYOUR_CONTRACT_ADDRESS" }

# Test 13: File Structure Validation
Run-Test "Required Files Exist" { 
    (Test-Path "contracts/FlowSubs.cdc") -and 
    (Test-Path "transactions/setup_demo_data.cdc") -and 
    (Test-Path "scripts/setup_demo_data.ps1") 
}

# Test 14: Transaction File Syntax
if (Test-Path "transactions/register_demo_provider.cdc") {
    Run-Test "Provider Registration Transaction Syntax" { flow transactions build transactions/register_demo_provider.cdc --dry-run }
}

if (Test-Path "transactions/create_demo_subscription.cdc") {
    Run-Test "Subscription Creation Transaction Syntax" { flow transactions build transactions/create_demo_subscription.cdc --dry-run }
}

# Test 15: Script File Syntax
if (Test-Path "scripts/get_demo_data.cdc") {
    Run-Test "Demo Data Query Script Syntax" { flow scripts build scripts/get_demo_data.cdc --dry-run }
}

Write-Host ""
Write-Host "📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "Total Tests: $TotalTests" -ForegroundColor Blue
Write-Host "Passed: $PassedTests" -ForegroundColor Green
Write-Host "Failed: $FailedTests" -ForegroundColor Red

if ($FailedTests -eq 0) {
    Write-Host ""
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ FlowSubs demo data is ready for deployment and testing" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy your contract to Flow testnet" -ForegroundColor White
    Write-Host "2. Update contract address in all files" -ForegroundColor White
    Write-Host "3. Run the demo data setup script" -ForegroundColor White
    Write-Host "4. Test with your frontend application" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands to run:" -ForegroundColor Yellow
    Write-Host "  flow contracts deploy contracts/FlowSubs.cdc --network testnet" -ForegroundColor White
    Write-Host "  .\scripts\setup_demo_data.ps1 -ContractAddress $ContractAddress" -ForegroundColor White
    Write-Host "  flow scripts execute scripts/get_demo_data.cdc --network testnet" -ForegroundColor White
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the failed tests and fix any issues before proceeding." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "• Contract address not updated (replace 0xYOUR_CONTRACT_ADDRESS)" -ForegroundColor White
    Write-Host "• Flow CLI not properly installed" -ForegroundColor White
    Write-Host "• Missing dependencies (Node.js, Jest)" -ForegroundColor White
    Write-Host "• Syntax errors in Cadence files" -ForegroundColor White
    exit 1
}
