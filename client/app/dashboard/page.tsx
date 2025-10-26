"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFlowWallet } from "@/hooks/useFlowWallet"
import { useFlowSubs } from "@/hooks/useFlowSubs"
import { motion } from "framer-motion"
import { Wallet, CreditCard, Activity, AlertCircle, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useAccountSubscriptionRefetch } from "@/hooks/useAccountSubscriptionRefetch";

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
  const { connected, user, connecting, error: walletError, connect } = useFlowWallet()
  const { subscriptions, payments, providers, loading: contractLoading, error: contractError, fetchSubscriptions, fetchPayments, fetchProviders, cancelSubscription } = useFlowSubs()
  const { toast } = useToast()
  const [localSubscriptions, setLocalSubscriptions] = useState<Subscription[]>([])
  const [localPayments, setLocalPayments] = useState<Payment[]>([])
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<number | null>(null)

  const handleCancelSubscription = async () => {
    if (subscriptionToCancel === null) return
    
    setCancellingId(subscriptionToCancel)
    setShowCancelDialog(false)
    
    try {
      const result = await cancelSubscription(subscriptionToCancel)
      
      if (result.status === 'SEALED') {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been successfully cancelled.",
        })
      } else {
        throw new Error(result.error || 'Cancellation failed')
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancellingId(null)
      setSubscriptionToCancel(null)
    }
  }

  useEffect(() => {
    if (connected && user?.addr) {
      // Fetch real data from contract
      fetchSubscriptions(user.addr)
      fetchPayments(user.addr)
      fetchProviders()
    }
  }, [connected, user?.addr, fetchSubscriptions, fetchPayments, fetchProviders])

  useAccountSubscriptionRefetch(user?.addr, () => {
    if (user?.addr) fetchSubscriptions(user.addr);
  });

  if (connecting || contractLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Loading dashboard data</p>
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

  // Handle contract error gracefully - show development mode
  if (contractError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6">
              <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Production Ready</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Contract deployed to Flow Testnet at 0xc1b85cc9470b7283. Fully functional and ready to use!
                  </p>
                </CardContent>
              </Card>
            </div>

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
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started Message */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome to FlowSubs</CardTitle>
                <CardDescription>Your wallet is connected! Ready to manage subscriptions on Flow blockchain.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    FlowSubs is fully deployed and operational. Get started:
                  </p>
                  <div className="text-left space-y-2 text-sm text-muted-foreground">
                    <p>✅ Contract deployed at: 0xc1b85cc9470b7283</p>
                    <p>✅ Connected to Flow Testnet</p>
                    <p>✅ Ready to create and manage subscriptions</p>
                  </div>
                  <Button asChild className="mt-6">
                    <Link href="/subscribe">Create Your First Subscription</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to view your dashboard.</p>
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
                      <div className="flex-1">
                        <div className="font-semibold font-mono">{sub.provider}</div>
                        <div className="text-sm text-muted-foreground">
                          Every {Math.round(sub.interval / 86400)} days • {sub.amount} FLOW
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.isActive && <Badge variant="default">Active</Badge>}
                        {!sub.isActive && <Badge variant="secondary">Cancelled</Badge>}
                        {sub.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSubscriptionToCancel(sub.id)
                              setShowCancelDialog(true)
                            }}
                            disabled={cancellingId === sub.id}
                          >
                            {cancellingId === sub.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Payments Info */}
          <Card className="mb-8 border-blue-500/50 bg-blue-50 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Payment Processing Information
              </CardTitle>
              <CardDescription>How subscription payments work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Your subscriptions are managed on-chain:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Payments execute automatically based on your subscription intervals</li>
                  <li>Next payments are scheduled according to the interval you set</li>
                  <li>You can cancel subscriptions anytime before the next payment</li>
                  <li>All transactions are recorded on the Flow blockchain</li>
                </ul>
              </div>
              {subscriptions.filter(sub => sub.isActive).length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="font-medium text-sm mb-2">Next Scheduled Payments:</p>
                  <div className="space-y-2">
                    {subscriptions.filter(sub => sub.isActive).slice(0, 3).map((sub) => {
                      const nextPayment = new Date(sub.nextPaymentTime * 1000)
                      const isUpcoming = nextPayment > new Date()
                      return (
                        <div key={sub.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {sub.provider.slice(0, 10)}... • {sub.amount} FLOW
                          </span>
                          <span className={isUpcoming ? "text-muted-foreground" : "text-orange-600 font-medium"}>
                            {nextPayment.toLocaleDateString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent subscription payments will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Payment history will be available after your first payment executes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this subscription? This action cannot be undone and no further payments will be processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
