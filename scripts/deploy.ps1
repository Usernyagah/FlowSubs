# FlowSubs Deployment Script for Windows PowerShell
# Deploys the FlowSubs contract to Flow testnet

param(
    [Parameter(Mandatory=$true)]
    [string]$Network
)

if ($Network -ne "testnet") {
    Write-Host "⚠️  This script deploys to testnet. Use 'testnet' as argument to confirm." -ForegroundColor Yellow
    Write-Host "   Usage: .\scripts\deploy.ps1 -Network testnet" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Deploying FlowSubs contract to Flow testnet..." -ForegroundColor Green

# Check if Flow CLI is installed
try {
    $flowVersion = flow version
    Write-Host "✅ Flow CLI found: $flowVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Flow CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://docs.onflow.org/cli/install/" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Creating test account..." -ForegroundColor Blue
flow accounts create --network testnet

Write-Host "📦 Deploying FlowSubs contract..." -ForegroundColor Blue
flow contracts deploy contracts/FlowSubs.cdc --network testnet

Write-Host "✅ Contract deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update contract addresses in transaction files" -ForegroundColor White
Write-Host "2. Register as a provider using register_provider.cdc" -ForegroundColor White
Write-Host "3. Test subscription creation" -ForegroundColor White
Write-Host ""
Write-Host "🔗 View your contract on Flow Port:" -ForegroundColor Cyan
Write-Host "   https://testnet.flowport.io/" -ForegroundColor White

# Get the deployed contract address
try {
    $accountInfo = flow accounts get --network testnet
    $contractAddress = ($accountInfo | Select-String "Address").ToString().Split(":")[1].Trim()
    Write-Host ""
    Write-Host "📍 Contract Address: $contractAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Update these files with your contract address:" -ForegroundColor Yellow
    Write-Host "   - transactions/create_subscription.cdc" -ForegroundColor White
    Write-Host "   - transactions/cancel_subscription.cdc" -ForegroundColor White
    Write-Host "   - transactions/register_provider.cdc" -ForegroundColor White
    Write-Host "   - scripts/get_subscription.cdc" -ForegroundColor White
    Write-Host "   - scripts/get_provider_subscriptions.cdc" -ForegroundColor White
} catch {
    Write-Host "⚠️  Could not retrieve contract address automatically" -ForegroundColor Yellow
    Write-Host "   Please check your account info manually" -ForegroundColor Yellow
}
