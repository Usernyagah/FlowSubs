# FlowSubs Demo Data Setup Script for Windows PowerShell
# This script sets up demo data for FlowSubs on Flow testnet

param(
    [string]$ContractAddress = "0xYOUR_CONTRACT_ADDRESS",
    [string]$Network = "testnet"
)

Write-Host "🚀 Setting up FlowSubs Demo Data on Flow Testnet" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Demo provider data
$Providers = @(
    @{ Name = "Premium Streaming Service"; Description = "High-quality video streaming with premium content" },
    @{ Name = "Basic Cloud Storage"; Description = "Reliable cloud storage with basic features" },
    @{ Name = "Enterprise Analytics"; Description = "Advanced analytics and business intelligence tools" }
)

# Demo subscriber data (real Flow testnet addresses)
$Subscribers = @(
    "0x01cf0e2f2f715450",
    "0x179b6b1cb6755e31", 
    "0x7e60df042a9c0868",
    "0x01cf0e2f2f715451",
    "0x179b6b1cb6755e32",
    "0x7e60df042a9c0869",
    "0x01cf0e2f2f715452",
    "0x179b6b1cb6755e33"
)

# Subscription amounts (in FLOW)
$Amounts = @("5.0", "7.5", "10.0", "6.0", "8.0", "9.0", "5.5", "7.0")

# Monthly interval (30 days in seconds)
$MonthlyInterval = "2592000"

Write-Host "📋 Demo Data Configuration:" -ForegroundColor Cyan
Write-Host "  Contract Address: $ContractAddress" -ForegroundColor White
Write-Host "  Network: $Network" -ForegroundColor White
Write-Host "  Providers: $($Providers.Count)" -ForegroundColor White
Write-Host "  Subscribers: $($Subscribers.Count)" -ForegroundColor White
Write-Host "  Monthly Interval: $MonthlyInterval seconds (30 days)" -ForegroundColor White
Write-Host ""

# Check if Flow CLI is installed
try {
    $flowVersion = flow version
    Write-Host "✅ Flow CLI found: $flowVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Flow CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://docs.onflow.org/cli/install/" -ForegroundColor Yellow
    exit 1
}

# Check if contract address is set
if ($ContractAddress -eq "0xYOUR_CONTRACT_ADDRESS") {
    Write-Host "❌ Please update ContractAddress parameter with your deployed contract address" -ForegroundColor Red
    Write-Host "   Usage: .\scripts\setup_demo_data.ps1 -ContractAddress 0xYourContractAddress" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Contract address configured" -ForegroundColor Green
Write-Host ""

# Function to update contract address in files
function Update-ContractAddress {
    param($FilePath)
    if (Test-Path $FilePath) {
        (Get-Content $FilePath) -replace "0xYOUR_CONTRACT_ADDRESS", $ContractAddress | Set-Content $FilePath
        Write-Host "  ✅ Updated $FilePath" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  File not found: $FilePath" -ForegroundColor Yellow
    }
}

Write-Host "🔧 Updating contract addresses in transaction files..." -ForegroundColor Cyan
Update-ContractAddress "transactions/register_demo_provider.cdc"
Update-ContractAddress "transactions/create_demo_subscription.cdc"
Update-ContractAddress "scripts/get_demo_data.cdc"
Write-Host ""

Write-Host "📝 Demo Data Setup Instructions:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Since FlowSubs requires each user to create their own subscriptions," -ForegroundColor White
Write-Host "you'll need to run the following commands with different accounts:" -ForegroundColor White
Write-Host ""

Write-Host "1️⃣  Register Providers (run with 3 different accounts):" -ForegroundColor Yellow
for ($i = 0; $i -lt $Providers.Count; $i++) {
    $provider = $Providers[$i]
    Write-Host "   flow transactions send transactions/register_demo_provider.cdc \`" -ForegroundColor White
    Write-Host "     --args-json '[{`"type`": `"String`", `"value`": `"$($provider.Name)`"}, {`"type`": `"String`", `"value`": `"$($provider.Description)`"}]' \`" -ForegroundColor White
    Write-Host "     --network $Network" -ForegroundColor White
    Write-Host ""
}

Write-Host "2️⃣  Create Subscriptions (run with 8 different accounts):" -ForegroundColor Yellow
for ($i = 0; $i -lt $Subscribers.Count; $i++) {
    $providerIndex = [Math]::Floor($i / 3)  # Distribute subscribers across providers
    $providerAddress = $Subscribers[$providerIndex]
    $amount = $Amounts[$i]
    
    Write-Host "   # Subscription $($i+1) - $amount FLOW monthly" -ForegroundColor White
    Write-Host "   flow transactions send transactions/create_demo_subscription.cdc \`" -ForegroundColor White
    Write-Host "     --args-json '[{`"type`": `"Address`", `"value`": `"$providerAddress`"}, {`"type`": `"UFix64`", `"value`": `"$amount`"}, {`"type`": `"UFix64`", `"value`": `"$MonthlyInterval`"}]' \`" -ForegroundColor White
    Write-Host "     --network $Network" -ForegroundColor White
    Write-Host ""
}

Write-Host "3️⃣  Query Demo Data:" -ForegroundColor Yellow
Write-Host "   flow scripts execute scripts/get_demo_data.cdc --network $Network" -ForegroundColor White
Write-Host ""

Write-Host "📊 Expected Demo Data Structure:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Providers (3):" -ForegroundColor White
Write-Host "  • Premium Streaming Service (0x1234567890abcdef)" -ForegroundColor White
Write-Host "  • Basic Cloud Storage (0xfedcba0987654321)" -ForegroundColor White
Write-Host "  • Enterprise Analytics (0x9876543210fedcba)" -ForegroundColor White
Write-Host ""
Write-Host "Subscriptions (8):" -ForegroundColor White
Write-Host "  • 3 subscriptions to Premium Streaming Service (5.0, 7.5, 10.0 FLOW)" -ForegroundColor White
Write-Host "  • 3 subscriptions to Basic Cloud Storage (6.0, 8.0, 9.0 FLOW)" -ForegroundColor White
Write-Host "  • 2 subscriptions to Enterprise Analytics (5.5, 7.0 FLOW)" -ForegroundColor White
Write-Host ""
Write-Host "All subscriptions are set to monthly payments (30 days)" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Frontend Integration:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your React hooks can now query this demo data:" -ForegroundColor White
Write-Host ""
Write-Host "  // Get all providers" -ForegroundColor Gray
Write-Host "  const providers = await fetchProviders();" -ForegroundColor Gray
Write-Host ""
Write-Host "  // Get subscriptions for a specific address" -ForegroundColor Gray
Write-Host "  const subscriptions = await fetchSubscriptions('0x1111111111111111');" -ForegroundColor Gray
Write-Host ""
Write-Host "  // Get payment history" -ForegroundColor Gray
Write-Host "  const payments = await fetchPayments('0x1111111111111111');" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Demo data setup instructions complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "  • Use Flow Port (https://testnet.flowport.io/) for easy account management" -ForegroundColor White
Write-Host "  • Each transaction requires a different account with FLOW tokens" -ForegroundColor White
Write-Host "  • Monitor transactions on Flow Testnet Explorer" -ForegroundColor White
Write-Host "  • Test your frontend with the mock data first before using real contracts" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "  • Flow Testnet Explorer: https://testnet.flowscan.org/" -ForegroundColor White
Write-Host "  • Flow Port: https://testnet.flowport.io/" -ForegroundColor White
Write-Host "  • Flow CLI Docs: https://docs.onflow.org/cli/" -ForegroundColor White
