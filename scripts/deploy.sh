#!/bin/bash

# FlowSubs Deployment Script
# Deploys the FlowSubs contract to Flow testnet

set -e

echo "🚀 Deploying FlowSubs contract to Flow testnet..."

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI is not installed. Please install it first:"
    echo "   https://docs.onflow.org/cli/install/"
    exit 1
fi

# Check if we're on testnet
if [ "$1" != "testnet" ]; then
    echo "⚠️  This script deploys to testnet. Use 'testnet' as argument to confirm."
    echo "   Usage: ./scripts/deploy.sh testnet"
    exit 1
fi

echo "📋 Creating test account..."
flow accounts create --network testnet

echo "📦 Deploying FlowSubs contract..."
flow contracts deploy contracts/FlowSubs.cdc --network testnet

echo "✅ Contract deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Update contract addresses in transaction files"
echo "2. Register as a provider using register_provider.cdc"
echo "3. Test subscription creation"
echo ""
echo "🔗 View your contract on Flow Port:"
echo "   https://testnet.flowport.io/"

# Get the deployed contract address
CONTRACT_ADDRESS=$(flow accounts get --network testnet | grep "Address" | awk '{print $2}')
echo ""
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo ""
echo "🔄 Update these files with your contract address:"
echo "   - transactions/create_subscription.cdc"
echo "   - transactions/cancel_subscription.cdc"
echo "   - transactions/register_provider.cdc"
echo "   - scripts/get_subscription.cdc"
echo "   - scripts/get_provider_subscriptions.cdc"

