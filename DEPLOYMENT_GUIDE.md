# Manual Contract Deployment Guide

## Option 1: Using Flow CLI (Recommended)

### Step 1: Install Flow CLI
```bash
# Windows (using Chocolatey)
choco install flow-cli

# Or download from: https://github.com/onflow/flow-cli/releases
```

### Step 2: Initialize Flow Project
```bash
flow init
```

### Step 3: Configure flow.json
Create a `flow.json` file in your project root:

```json
{
  "accounts": {
    "testnet-account": {
      "address": "YOUR_ACCOUNT_ADDRESS",
      "key": {
        "type": "hex",
        "index": 0,
        "signatureAlgorithm": "ECDSA_P256",
        "hashAlgorithm": "SHA3_256",
        "privateKey": "b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf"
      }
    }
  },
  "contracts": {
    "FlowSubs": "./contracts/FlowSubs.cdc"
  },
  "deployments": {
    "testnet": {
      "testnet-account": ["FlowSubs"]
    }
  }
}
```

### Step 4: Deploy Contract
```bash
flow project deploy --network testnet
```

## Option 2: Using Flow Port (Web Interface)

1. Go to https://testnet.flowport.io/
2. Connect your wallet using the private key
3. Navigate to "Deploy Contract"
4. Upload the `contracts/FlowSubs.cdc` file
5. Deploy the contract

## Option 3: Using Flow JavaScript SDK

Run the deployment script:
```bash
node scripts/deploy-contract.js
```

## After Deployment

1. **Get Contract Address**: Note the deployed contract address
2. **Update Configuration**: Replace `0x1234567890123456` in `.env.local` with the real address
3. **Test Contract**: Verify the contract is working by creating a subscription

## Your Private Key
- **Private Key**: `b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf`
- **Network**: Flow Testnet
- **Contract**: FlowSubs.cdc
