# FlowSubs Project Structure

This project is organized into separate concerns for better maintainability.

## Directory Structure

```
flowsubs-app/
├── client/              # Next.js Frontend Application
│   ├── app/            # Next.js 15 App Router pages
│   │   ├── dashboard/  # User dashboard
│   │   ├── subscribe/  # Create subscriptions
│   │   ├── page.tsx    # Landing page
│   │   └── layout.tsx  # App layout
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions & FCL config
│   ├── public/         # Static assets
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── package.json    # Frontend dependencies
│   └── .env.local      # Environment variables
│
├── cadence/            # Smart Contracts (Cadence 1.0)
│   └── contracts/
│       └── FlowSubs.cdc
│
├── transactions/       # Cadence Transactions
│   ├── create_subscription.cdc
│   ├── cancel_subscription.cdc
│   └── register_provider.cdc
│
├── scripts/           # Cadence Read Scripts
│   ├── get_subscription.cdc
│   └── get_provider_subscriptions.cdc
│
├── tests/             # Contract Tests
│   └── FlowSubs_test.cdc
│
├── flow.json          # Flow CLI Configuration
└── README.md          # Project Documentation
```

## Quick Start

### 1. Install Frontend Dependencies

```bash
cd client
pnpm install
```

### 2. Configure Environment

Create `client/.env.local`:
```bash
NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xc1b85cc9470b7283
```

### 3. Start Development Server

```bash
cd client
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployed Contract

**Network**: Flow Testnet  
**Address**: `0xc1b85cc9470b7283`

## Development Workflow

### Frontend Development
```bash
cd client
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm start      # Start production server
```

### Contract Testing
```bash
# From project root
flow test tests/FlowSubs_test.cdc
```

### Deploy Contract (Optional)
```bash
# From project root
flow project deploy --network testnet
```

## Technologies

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Blockchain**: Flow, Cadence 1.0, FCL (Flow Client Library)
- **Wallet**: Blocto, Lilico, Flow Wallet support
