#!/bin/bash

# FlowSubs Demo Data Setup Script
# This script sets up demo data for FlowSubs on Flow testnet

set -e

echo "🚀 Setting up FlowSubs Demo Data on Flow Testnet"
echo "================================================"

# Configuration
CONTRACT_ADDRESS="0xYOUR_CONTRACT_ADDRESS"  # Replace with your deployed contract address
NETWORK="testnet"

# Demo provider data
declare -a PROVIDERS=(
    "Premium Streaming Service|High-quality video streaming with premium content"
    "Basic Cloud Storage|Reliable cloud storage with basic features"
    "Enterprise Analytics|Advanced analytics and business intelligence tools"
)

# Demo subscriber data (real Flow testnet addresses)
declare -a SUBSCRIBERS=(
    "0x01cf0e2f2f715450"
    "0x179b6b1cb6755e31"
    "0x7e60df042a9c0868"
    "0x01cf0e2f2f715451"
    "0x179b6b1cb6755e32"
    "0x7e60df042a9c0869"
    "0x01cf0e2f2f715452"
    "0x179b6b1cb6755e33"
)

# Subscription amounts (in FLOW)
declare -a AMOUNTS=(
    "5.0"
    "7.5"
    "10.0"
    "6.0"
    "8.0"
    "9.0"
    "5.5"
    "7.0"
)

# Monthly interval (30 days in seconds)
MONTHLY_INTERVAL="2592000"

echo "📋 Demo Data Configuration:"
echo "  Contract Address: $CONTRACT_ADDRESS"
echo "  Network: $NETWORK"
echo "  Providers: ${#PROVIDERS[@]}"
echo "  Subscribers: ${#SUBSCRIBERS[@]}"
echo "  Monthly Interval: $MONTHLY_INTERVAL seconds (30 days)"
echo ""

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI is not installed. Please install it first:"
    echo "   https://docs.onflow.org/cli/install/"
    exit 1
fi

# Check if contract address is set
if [ "$CONTRACT_ADDRESS" = "0xYOUR_CONTRACT_ADDRESS" ]; then
    echo "❌ Please update CONTRACT_ADDRESS in this script with your deployed contract address"
    exit 1
fi

echo "✅ Flow CLI found"
echo "✅ Contract address configured"
echo ""

# Function to update contract address in files
update_contract_address() {
    local file=$1
    if [ -f "$file" ]; then
        sed -i "s/0xYOUR_CONTRACT_ADDRESS/$CONTRACT_ADDRESS/g" "$file"
        echo "  ✅ Updated $file"
    else
        echo "  ⚠️  File not found: $file"
    fi
}

echo "🔧 Updating contract addresses in transaction files..."
update_contract_address "transactions/register_demo_provider.cdc"
update_contract_address "transactions/create_demo_subscription.cdc"
update_contract_address "scripts/get_demo_data.cdc"
echo ""

echo "📝 Demo Data Setup Instructions:"
echo "================================"
echo ""
echo "Since FlowSubs requires each user to create their own subscriptions,"
echo "you'll need to run the following commands with different accounts:"
echo ""

echo "1️⃣  Register Providers (run with 3 different accounts):"
echo "   flow transactions send transactions/register_demo_provider.cdc \\"
echo "     --args-json '[{\"type\": \"String\", \"value\": \"Premium Streaming Service\"}, {\"type\": \"String\", \"value\": \"High-quality video streaming with premium content\"}]' \\"
echo "     --network $NETWORK"
echo ""
echo "   flow transactions send transactions/register_demo_provider.cdc \\"
echo "     --args-json '[{\"type\": \"String\", \"value\": \"Basic Cloud Storage\"}, {\"type\": \"String\", \"value\": \"Reliable cloud storage with basic features\"}]' \\"
echo "     --network $NETWORK"
echo ""
echo "   flow transactions send transactions/register_demo_provider.cdc \\"
echo "     --args-json '[{\"type\": \"String\", \"value\": \"Enterprise Analytics\"}, {\"type\": \"String\", \"value\": \"Advanced analytics and business intelligence tools\"}]' \\"
echo "     --network $NETWORK"
echo ""

echo "2️⃣  Create Subscriptions (run with 8 different accounts):"
for i in "${!SUBSCRIBERS[@]}"; do
    provider_index=$((i / 3))  # Distribute subscribers across providers
    provider_address=${SUBSCRIBERS[$provider_index]}
    amount=${AMOUNTS[$i]}
    
    echo "   # Subscription $((i+1)) - ${amount} FLOW monthly"
    echo "   flow transactions send transactions/create_demo_subscription.cdc \\"
    echo "     --args-json '[{\"type\": \"Address\", \"value\": \"$provider_address\"}, {\"type\": \"UFix64\", \"value\": \"$amount\"}, {\"type\": \"UFix64\", \"value\": \"$MONTHLY_INTERVAL\"}]' \\"
    echo "     --network $NETWORK"
    echo ""
done

echo "3️⃣  Query Demo Data:"
echo "   flow scripts execute scripts/get_demo_data.cdc --network $NETWORK"
echo ""

echo "📊 Expected Demo Data Structure:"
echo "================================"
echo ""
echo "Providers (3):"
echo "  • Premium Streaming Service (0x1234567890abcdef)"
echo "  • Basic Cloud Storage (0xfedcba0987654321)"
echo "  • Enterprise Analytics (0x9876543210fedcba)"
echo ""
echo "Subscriptions (8):"
echo "  • 3 subscriptions to Premium Streaming Service (5.0, 7.5, 10.0 FLOW)"
echo "  • 3 subscriptions to Basic Cloud Storage (6.0, 8.0, 9.0 FLOW)"
echo "  • 2 subscriptions to Enterprise Analytics (5.5, 7.0 FLOW)"
echo ""
echo "All subscriptions are set to monthly payments (30 days)"
echo ""

echo "🎯 Frontend Integration:"
echo "========================"
echo ""
echo "Your React hooks can now query this demo data:"
echo ""
echo "  // Get all providers"
echo "  const providers = await fetchProviders();"
echo ""
echo "  // Get subscriptions for a specific address"
echo "  const subscriptions = await fetchSubscriptions('0x1111111111111111');"
echo ""
echo "  // Get payment history"
echo "  const payments = await fetchPayments('0x1111111111111111');"
echo ""

echo "✅ Demo data setup instructions complete!"
echo ""
echo "💡 Tips:"
echo "  • Use Flow Port (https://testnet.flowport.io/) for easy account management"
echo "  • Each transaction requires a different account with FLOW tokens"
echo "  • Monitor transactions on Flow Testnet Explorer"
echo "  • Test your frontend with the mock data first before using real contracts"
echo ""
echo "🔗 Useful Links:"
echo "  • Flow Testnet Explorer: https://testnet.flowscan.org/"
echo "  • Flow Port: https://testnet.flowport.io/"
echo "  • Flow CLI Docs: https://docs.onflow.org/cli/"
