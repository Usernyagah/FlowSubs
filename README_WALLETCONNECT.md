# WalletConnect Setup Instructions

## Getting Your WalletConnect Project ID

To resolve the WalletConnect warning and enable full wallet compatibility, you need to register for a WalletConnect project ID.

### Steps:

1. **Visit WalletConnect Cloud**
   - Go to [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)

2. **Create Account/Login**
   - Sign up for a new account or log in with existing credentials

3. **Create New Project**
   - Click "Create Project" or "New Project"
   - Fill in your project details:
     - **Project Name**: FlowSubs
     - **Project Description**: Blockchain subscription management platform
     - **Project URL**: Your app URL (e.g., https://flowsubs.com)

4. **Get Project ID**
   - After creating the project, you'll see a Project ID
   - Copy this ID (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

5. **Configure Environment Variable**
   - Create a `.env.local` file in your project root
   - Add the following line:
     ```
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
     ```

6. **Restart Development Server**
   - Stop your development server (Ctrl+C)
   - Run `npm run dev` again

### Alternative: Temporary Fix

If you want to suppress the warning temporarily for development, you can:

1. Open `lib/fcl-config.ts`
2. Replace `'YOUR_WALLETCONNECT_PROJECT_ID'` with a temporary string
3. This will suppress the warning but won't enable full wallet compatibility

### Why This Matters

The WalletConnect project ID is required for:
- **MetaMask** wallet connections
- **WalletConnect** compatible wallets
- **Mobile wallet** integrations
- **Cross-platform** wallet support

Without it, users with certain wallets won't be able to connect to your dApp.

## Environment Variables

Create a `.env.local` file with these variables:

```env
# Required for WalletConnect integration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Customize your app
NEXT_PUBLIC_APP_TITLE=FlowSubs - Subscription Management
NEXT_PUBLIC_APP_URL=https://flowsubs.com
NEXT_PUBLIC_APP_ICON=https://your-domain.com/icon.png

# Optional: Contract address (replace when deployed)
NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

## Testing

After setting up the WalletConnect project ID:

1. Open your app in the browser
2. Try connecting different wallets
3. The warning should no longer appear in the console
4. All supported wallets should work properly
