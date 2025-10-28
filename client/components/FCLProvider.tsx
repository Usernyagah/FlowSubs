"use client"

import { useEffect } from 'react'
import { initializeFCL } from '@/lib/fcl-config'

export function FCLProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize FCL on client-side mount
    // The guard in initializeFCL prevents duplicate initialization
    initializeFCL()
  }, [])

  return <>{children}</>
}
