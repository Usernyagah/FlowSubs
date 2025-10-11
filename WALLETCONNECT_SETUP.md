# Quick Setup Guide for WalletConnect Project ID

## 🚀 Quick Fix (Temporary)
The warning should now be suppressed with a temporary project ID. Your app will work normally for development.

## 🔧 Permanent Solution

To get your **real WalletConnect Project ID**:

### Step 1: Visit WalletConnect Cloud
Go to: **https://cloud.walletconnect.com/**

### Step 2: Create Account
- Sign up with email or GitHub
- Verify your email if required

### Step 3: Create New Project
- Click **"Create Project"** or **"New Project"**
- Fill in the details:
  - **Project Name**: `FlowSubs`
  - **Project Description**: `Blockchain subscription management platform`
  - **Project URL**: `http://localhost:3001` (for development)

### Step 4: Get Project ID
- After creating the project, you'll see a **Project ID**
- It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Copy this ID**

### Step 5: Set Environment Variable
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### Step 6: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ What This Enables

With a real WalletConnect Project ID, users can connect with:
- **MetaMask** wallet
- **WalletConnect** compatible wallets
- **Mobile wallets** (via QR codes)
- **Cross-platform** wallet support

## 🚨 Important Notes

- The temporary ID (`temp-dev-project-id`) suppresses the warning but doesn't enable full wallet compatibility
- For production, you **must** use a real WalletConnect Project ID
- The Project ID is free and takes 2 minutes to set up

## 🔍 Verification

After setting up the real Project ID:
1. Open your app in the browser
2. Check the console - the warning should be gone
3. Try connecting different wallets
4. All supported wallets should work properly

---

**Need help?** Check the full documentation at: https://developers.flow.com/tools/clients/fcl-js/configure-fcl
