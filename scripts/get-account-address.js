// scripts/get-account-address.js
// Get account address from private key

const { config, send, transaction, proposer, payer, authorizations } = require('@onflow/fcl');

// Configure FCL for testnet
config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});

async function getAccountAddress() {
  try {
    console.log('🔍 Getting account address from private key...');
    
    // Create a simple transaction to get the account address
    const getAddressTransaction = `
      transaction {
        prepare(signer: AuthAccount) {
          log("Account address: ".concat(signer.address.toString()))
        }
      }
    `;
    
    console.log('📋 To get your account address:');
    console.log('1. Go to https://testnet.flowport.io/');
    console.log('2. Connect wallet with private key:');
    console.log('   b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf');
    console.log('3. Execute this transaction:');
    console.log('');
    console.log(getAddressTransaction);
    console.log('');
    console.log('4. The account address will be logged');
    console.log('5. This address will be your contract address after deployment');
    
    // Try to derive address from private key (this is a simplified approach)
    console.log('\\n🔑 Private Key Info:');
    console.log('Private Key:', 'b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf');
    console.log('Length:', 'b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf'.length);
    
    // For Flow, we can't directly derive the address from private key without the account
    // The address is generated when the account is created on Flow testnet
    console.log('\\n⚠️  Note: Flow account addresses are generated when the account is created');
    console.log('   You need to connect to Flow Port to see your account address');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAccountAddress();
