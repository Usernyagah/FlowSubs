"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useFlowWallet } from "@/hooks/useFlowWallet"
import { useFlowSubs } from "@/hooks/useFlowSubs"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

export default function SubscribePage() {
  const { connected, connecting, error: walletError, connect } = useFlowWallet()
  const { createSubscription, loading: contractLoading, error: contractError } = useFlowSubs()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    provider: "",
    amount: "",
    interval: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createSubscription({
        provider: formData.provider,
        amount: parseFloat(formData.amount),
        interval: parseFloat(formData.interval) * 86400, // Convert days to seconds
      })

      if (result.status === 'SEALED') {
        toast({
          title: "Subscription Created!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Your subscription has been set up successfully.</span>
            </div>
          ),
        })

        // Reset form
        setFormData({ provider: "", amount: "", interval: "" })
      } else {
        throw new Error(result.error || 'Transaction failed')
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "There was an error creating your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (connecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
            <p className="text-muted-foreground">Connecting to Flow wallet</p>
          </Card>
        </div>
      </div>
    )
  }

  if (walletError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12 border-destructive">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Connection Error</h2>
            <p className="text-muted-foreground mb-6">{walletError}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </div>
      </div>
    )
  }

  // Note: Removed development mode check since contract is deployed

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to create a subscription.</p>
            <Button onClick={connect} disabled={connecting}>
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2">Create Subscription</h1>
          <p className="text-muted-foreground mb-8">Set up a recurring payment to a provider on the Flow blockchain.</p>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Enter the provider address, amount, and payment interval</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider Address</Label>
                  <Input
                    id="provider"
                    placeholder="0x1234567890abcdef"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    required
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">The Flow address that will receive payments</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (FLOW)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Amount to pay per interval in FLOW tokens</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Payment Interval (days)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">How often payments should be made (in days)</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Amount:</span>
                      <span className="font-semibold">{formData.amount || "0.00"} FLOW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-semibold">Every {formData.interval || "0"} days</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || contractLoading}>
                  {isLoading || contractLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Subscription...
                    </>
                  ) : (
                    "Create Subscription"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important Information
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure you have sufficient FLOW balance for recurring payments</li>
                <li>You can cancel subscriptions at any time from your dashboard</li>
                <li>Payments are executed automatically via smart contracts</li>
                <li>Transaction fees apply to each payment</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
