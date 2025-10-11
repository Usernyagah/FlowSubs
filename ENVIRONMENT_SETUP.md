# Environment Setup Guide

## WalletConnect Project ID Setup

To fix the WalletConnect warning and enable full wallet compatibility, you need to set up a WalletConnect Project ID.

### Quick Setup Steps:

1. **Visit WalletConnect Cloud**: Go to https://cloud.walletconnect.com/
2. **Create Account**: Sign up with email or GitHub
3. **Create New Project**:
   - Project Name: `FlowSubs`
   - Description: `Blockchain subscription management platform`
   - Project URL: `http://localhost:3000` (for development)
4. **Copy Project ID**: It looks like `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
5. **Create `.env.local` file** in your project root:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
   ```
6. **Restart your development server**

### What This Enables:
- MetaMask wallet support
- WalletConnect compatible wallets
- Mobile wallet support via QR codes
- Cross-platform wallet compatibility

### Current Status:
The app will work without a WalletConnect Project ID, but some wallets may not be available. The warning has been converted to informational messages.

### Files Modified:
- `lib/fcl-config.ts` - Updated to handle missing project ID gracefully
- Added informational messages instead of warnings
