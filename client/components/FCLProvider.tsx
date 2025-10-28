"use client"

export function FCLProvider({ children }: { children: React.ReactNode }) {
  // FCL is already initialized at module load time in fcl-config.ts
  // This component just wraps children
  return <>{children}</>
}
