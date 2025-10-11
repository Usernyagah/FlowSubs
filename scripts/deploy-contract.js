// scripts/deploy-contract.js
// Deploy FlowSubs contract to Flow testnet using JavaScript SDK

const { send, transaction, proposer, payer, authorizations } = require('@onflow/fcl');
const { config } = require('@onflow/fcl');
const fs = require('fs');
const path = require('path');

// Configure FCL for testnet
config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});

async function deployContract() {
  try {
    console.log('🚀 Starting FlowSubs contract deployment to testnet...');
    
    // Read the contract file
    const contractPath = path.join(__dirname, '../contracts/FlowSubs.cdc');
    const contractCode = fs.readFileSync(contractPath, 'utf8');
    
    console.log('📄 Contract code loaded');
    
    // Create deployment transaction
    const deployTransaction = `
      transaction {
        prepare(signer: AuthAccount) {
          // Deploy the FlowSubs contract
          let contract = Contract(name: "FlowSubs", code: \`${contractCode}\`)
          signer.contracts.add(name: "FlowSubs", code: contract.code)
          
          log("FlowSubs contract deployed successfully!")
        }
      }
    `;
    
    console.log('📝 Deployment transaction created');
    console.log('⚠️  Note: This script requires manual wallet connection');
    console.log('   Please connect your wallet in the browser to complete deployment');
    
    // For now, just log the transaction
    console.log('\\n📋 Deployment Transaction:');
    console.log(deployTransaction);
    
    console.log('\\n✅ Contract deployment script ready');
    console.log('   To complete deployment:');
    console.log('   1. Connect your wallet with the private key');
    console.log('   2. Execute the deployment transaction');
    console.log('   3. Note the deployed contract address');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
}

deployContract();
