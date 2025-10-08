# FlowSubs App

A modern subscription management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Modern Stack**: Next.js 15 with React 19 and TypeScript
- 🎨 **Beautiful UI**: Tailwind CSS with shadcn/ui components
- 🌙 **Dark Mode**: Theme switching with next-themes
- 📱 **Responsive**: Mobile-first design with responsive layouts
- 📊 **Dashboard**: Subscription overview and management
- 💳 **Subscription Flow**: Step-by-step subscription process
- ✅ **Form Validation**: React Hook Form with Zod validation
- 🎯 **Type Safety**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd flowsubs-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
flowsubs-app/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── subscribe/         # Subscription flow
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation component
│   └── theme-*.tsx       # Theme components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
