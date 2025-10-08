"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface FlowContextType {
  user: any
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  executeTransaction: (cadence: string, args?: any[]) => Promise<string>
  executeScript: (cadence: string, args?: any[]) => Promise<any>
  isLoading: boolean
  error: string | null
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const initMockFlow = async () => {
      try {
        // Simulate initialization delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
        console.log("[v0] Mock Flow context initialized (FCL not available in preview)")
      } catch (err) {
        console.error("[v0] Failed to initialize:", err)
        setError("Failed to initialize")
        setIsLoading(false)
      }
    }

    initMockFlow()
  }, [])

  const connect = async () => {
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser = {
        addr: "0x1234567890abcdef",
        loggedIn: true,
        cid: "mock-cid",
        expiresAt: Date.now() + 3600000,
      }

      setUser(mockUser)
      setIsConnected(true)

      toast({
        title: "Wallet Connected",
        description: "Mock wallet connected successfully (preview mode)",
      })

      console.log("[v0] Mock wallet connected:", mockUser.addr)
    } catch (err) {
      console.error("[v0] Failed to connect wallet:", err)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const disconnect = () => {
    setUser(null)
    setIsConnected(false)

    toast({
      title: "Wallet Disconnected",
      description: "Wallet disconnected successfully",
    })

    console.log("[v0] Mock wallet disconnected")
  }

  const executeTransaction = async (cadence: string, args: any[] = []) => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    console.log("[v0] Mock transaction:", { cadence, args })

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockTxId = `0x${Math.random().toString(16).slice(2, 18)}`

    toast({
      title: "Transaction Submitted",
      description: `Transaction ID: ${mockTxId.slice(0, 10)}...`,
    })

    return mockTxId
  }

  const executeScript = async (cadence: string, args: any[] = []) => {
    console.log("[v0] Mock script:", { cadence, args })

    // Simulate script delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock data based on script type
    if (cadence.includes("subscription")) {
      return [
        {
          id: "1",
          name: "Premium Plan",
          amount: "9.99",
          interval: "monthly",
          status: "active",
        },
      ]
    }

    return null
  }

  return (
    <FlowContext.Provider
      value={{
        user,
        isConnected,
        connect,
        disconnect,
        executeTransaction,
        executeScript,
        isLoading,
        error,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider")
  }
  return context
}
