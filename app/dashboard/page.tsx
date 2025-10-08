"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFlow } from "@/contexts/flow-context"
import { motion } from "framer-motion"
import { Wallet, CreditCard, Activity, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Subscription {
  id: string
  provider: string
  amount: string
  interval: number
  nextPayment: Date
  status: "active" | "paused"
}

interface Payment {
  id: string
  provider: string
  amount: string
  timestamp: Date
  status: "success" | "pending" | "failed"
}

export default function DashboardPage() {
  const { isConnected, user, isLoading, error } = useFlow()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (isConnected) {
      // Mock data - in production, fetch from contract events
      setSubscriptions([
        {
          id: "1",
          provider: "0x1234...5678",
          amount: "10.00 FLOW",
          interval: 30,
          nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "active",
        },
        {
          id: "2",
          provider: "0xabcd...efgh",
          amount: "25.00 FLOW",
          interval: 7,
          nextPayment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: "active",
        },
      ])

      setPayments([
        {
          id: "1",
          provider: "0x1234...5678",
          amount: "10.00 FLOW",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: "success",
        },
        {
          id: "2",
          provider: "0xabcd...efgh",
          amount: "25.00 FLOW",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: "success",
        },
        {
          id: "3",
          provider: "0x1234...5678",
          amount: "10.00 FLOW",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: "success",
        },
      ])
    }
  }, [isConnected])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Initializing Flow blockchain connection</p>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12 border-destructive">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to view your dashboard.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {/* Wallet Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{user?.addr}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptions.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Subscriptions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>Manage your recurring payments</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No active subscriptions</p>
                  <Button asChild>
                    <Link href="/subscribe">Create Your First Subscription</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                    >
                      <div>
                        <div className="font-semibold font-mono">{sub.provider}</div>
                        <div className="text-sm text-muted-foreground">Every {sub.interval} days</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{sub.amount}</div>
                        <div className="text-sm text-muted-foreground">
                          Next: {sub.nextPayment.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent subscription payments</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No payment history yet</div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                    >
                      <div>
                        <div className="font-semibold font-mono">{payment.provider}</div>
                        <div className="text-sm text-muted-foreground">{payment.timestamp.toLocaleString()}</div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="font-bold">{payment.amount}</div>
                        <Badge variant={payment.status === "success" ? "default" : "secondary"}>{payment.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
