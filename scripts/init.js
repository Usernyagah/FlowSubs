// scripts/init.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Initializing FlowSubs project...');

// Create required directories
const dirs = [
  'cadence/contracts',
  'cadence/scripts',
  'cadence/transactions',
  'client/components',
  'client/lib',
  'client/pages/api'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create a sample .env.local file if it doesn't exist
const envPath = path.join(__dirname, '../client/.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# Flow Blockchain Configuration
NEXT_PUBLIC_FLOW_NETWORK=testnet
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_DISCOVERY_WALLET=https://fcl-discovery.onflow.org/testnet/authn
NEXT_PUBLIC_FLOW_DISCOVERY_WALLET_INCLUDE=0x82ec283f88a62e65

# Contract Addresses (will be updated after deployment)
NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('🔧 Created .env.local file with default configuration');
}

console.log('✅ Project initialization complete!');
console.log('\nNext steps:');
console.log('1. Update the .env.local file with your WalletConnect project ID');
console.log('2. Run `npm install` in both root and client directories');
console.log('3. Run `npm run dev` to start the development server');
