#!/usr/bin/env node
// scripts/deploy-simple.js
// Simple deployment script using Flow JavaScript SDK

const { send, transaction, proposer, payer, authorizations, config } = require('@onflow/fcl');
const fs = require('fs');
const path = require('path');

// Configure FCL for testnet
config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});

async function deployContract() {
  try {
    console.log('🚀 FlowSubs Contract Deployment');
    console.log('================================');
    console.log('');
    console.log('📋 Deployment Instructions:');
    console.log('1. Go to https://testnet.flowport.io/');
    console.log('2. Connect your wallet using private key:');
    console.log('   b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf');
    console.log('3. Navigate to "Execute Transaction"');
    console.log('4. Copy and paste the transaction code below:');
    console.log('');
    console.log('📄 Transaction Code:');
    console.log('================================');
    
    // Read the deployment transaction
    const transactionPath = path.join(__dirname, '../transactions/deploy_contract_direct.cdc');
    const transactionCode = fs.readFileSync(transactionPath, 'utf8');
    
    console.log(transactionCode);
    console.log('');
    console.log('✅ After deployment:');
    console.log('1. Note the contract address from the transaction result');
    console.log('2. Update .env.local with: NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=<your_address>');
    console.log('3. Restart your development server');
    console.log('');
    console.log('🔗 Alternative: Use Flow CLI if available');
    console.log('   flow project deploy --network testnet');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deployContract();
