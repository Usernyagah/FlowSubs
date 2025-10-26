"use client"

import { useEffect } from 'react'
import { initializeFCL } from '@/lib/fcl-config'

export function FCLProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
