# Vercel Deployment Guide for FlowSubs

## Quick Setup

### Step 1: Add Environment Variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS` | `0xc1b85cc9470b7283` | ✅ Yes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `2b9573d0cfcd983bc65de6e956573f28` | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` | ✅ Yes |

### Step 2: Replace Values

Replace the example values with your actual deployment:

1. **Contract Address**: Use your deployed FlowSubs contract address
2. **WalletConnect Project ID**: Get from https://cloud.walletconnect.com
3. **App URL**: Your actual Vercel deployment URL

### Step 3: Deploy

After adding the environment variables:
- Click **Redeploy** in your Vercel dashboard
- Or push a new commit to trigger automatic deployment

## Verification

Once deployed, verify:
- [ ] Wallet connection works
- [ ] Contract address is correct
- [ ] No CORS errors in browser console
- [ ] Subscriptions can be created/cancelled

## Environment Variable Details

### NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS
- **Where**: Flow Testnet deployed contract
- **Format**: Must start with `0x` followed by hex characters
- **Length**: 18 characters total
- **Example**: `0xc1b85cc9470b7283`

### NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
- **Where**: WalletConnect Cloud (https://cloud.walletconnect.com)
- **Format**: 32-character hex string
- **Note**: Required for wallet authentication

### NEXT_PUBLIC_APP_URL
- **Where**: Your Vercel deployment URL
- **Format**: Full HTTPS URL
- **Example**: `https://flow-subs.vercel.app`
- **Note**: Must match your actual deployment URL

## Troubleshooting

### "FCL already initialized" error
- This is now handled automatically in the code
- No action needed

### CORS errors
- CORS headers are configured in `next.config.mjs`
- No action needed

### Wallet won't connect
- Verify `NEXT_PUBLIC_APP_URL` matches your deployment URL
- Check that WalletConnect Project ID is correct

### Contract not found errors
- Verify contract address is correct
- Ensure contract is deployed to Flow Testnet
- Check that address is properly formatted (starts with `0x`)

