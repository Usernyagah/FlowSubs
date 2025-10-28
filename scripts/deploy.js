// scripts/deploy.js
const fcl = require('@onflow/fcl');
const { config } = require('@onflow/fcl');
const fs = require('fs');
const path = require('path');

// Configure FCL
fcl.config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('0xFlowToken', '0x7e60df042a9c0868')
  .put('0xFungibleToken', '0x9a0766d93b6608b7');

// Read the deployment transaction
const deployTx = fs.readFileSync(
  path.join(__dirname, '../transactions/deploy_contract.cdc'),
  'utf8'
);

async function deployContract() {
  try {
    console.log('🚀 Starting contract deployment...');
    
    // Authenticate the deployer account
    const auth = fcl.currentUser().authorization;
    
    // Send the deployment transaction
    const transactionId = await fcl.mutate({
      cadence: deployTx,
      limit: 9999,
      authorizations: [auth],
      payer: auth,
      proposer: auth,
    });
    
    console.log('⏳ Waiting for deployment transaction to be sealed...');
    const transaction = await fcl.tx(transactionId).onceSealed();
    
    if (transaction.errorMessage) {
      throw new Error(`Deployment failed: ${transaction.errorMessage}`);
    }
    
    console.log('✅ Contract deployed successfully!');
    console.log(`Transaction ID: ${transactionId}`);
    
    // Get the deployed contract address
    const events = transaction.events;
    const contractDeployedEvent = events.find(e => e.type.includes('AccountContractAdded'));
    
    if (contractDeployedEvent) {
      const contractAddress = contractDeployedEvent.data.address;
      console.log(`📝 Contract deployed at address: ${contractAddress}`);
      
      // Update the .env file with the new contract address
      updateEnvFile(contractAddress);
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

function updateEnvFile(contractAddress) {
  const envPath = path.join(__dirname, '../client/.env.local');
  let envContent = '';
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remove existing FLOWSUBS_CONTRACT_ADDRESS if it exists
    envContent = envContent.replace(/^NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=.*$/gm, '');
    // Remove any empty lines that might have been left behind
    envContent = envContent.replace(/\n\n+/g, '\n').trim();
  }
  
  // Add the new contract address
  envContent += `\nNEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=${contractAddress}\n`;
  
  // Write the updated content back to the file
  fs.writeFileSync(envPath, envContent);
  
  console.log('🔧 Updated .env.local with the new contract address');
}

// Run the deployment
deployContract().then(() => process.exit(0));
