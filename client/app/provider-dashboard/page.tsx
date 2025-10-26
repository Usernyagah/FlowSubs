"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFlowWallet } from "@/hooks/useFlowWallet"
import { useFlowSubs } from "@/hooks/useFlowSubs"
import { motion } from "framer-motion"
import { Wallet, Users, DollarSign, Activity, AlertCircle, Loader2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAccountSubscriptionRefetch } from "@/hooks/useAccountSubscriptionRefetch";

export default function ProviderDashboardPage() {
  const { connected, user, connecting, error: walletError, connect } = useFlowWallet()
  const { subscriptions, loading: contractLoading, error: contractError, fetchSubscriptions } = useFlowSubs()
  const [providerSubscriptions, setProviderSubscriptions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
  })

  // Fetch subscriptions on mount
  useEffect(() => {
    if (connected && user?.addr) {
      fetchSubscriptions(user.addr)
    }
  }, [connected, user?.addr, fetchSubscriptions])

  // Filter and calculate stats when subscriptions change
  useEffect(() => {
    if (connected && user?.addr && subscriptions.length > 0) {
      // Filter for subscriptions where user is provider
      const myProviderSubs = subscriptions.filter(
        sub => sub.provider.toLowerCase() === user.addr?.toLowerCase()
      )
      setProviderSubscriptions(myProviderSubs)
      
      // Calculate stats
      const active = myProviderSubs.filter(sub => sub.isActive).length
      const monthly = myProviderSubs
        .filter(sub => sub.isActive)
        .reduce((sum, sub) => sum + Number(sub.amount), 0)
      
      setStats({
        totalSubscribers: myProviderSubs.length,
        activeSubscriptions: active,
        monthlyRevenue: monthly,
        totalRevenue: monthly * 3, // Estimate (would need payment history)
      })
    }
  }, [subscriptions, connected, user?.addr])

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
            <p className="text-muted-foreground">Loading provider dashboard</p>
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

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to view your provider dashboard.</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Provider Dashboard</h1>
              <p className="text-muted-foreground">Manage your subscribers and track revenue</p>
            </div>
            <Button asChild>
              <Link href="/register-provider">Update Profile</Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeSubscriptions} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyRevenue.toFixed(2)} FLOW</div>
                <p className="text-xs text-muted-foreground">
                  From {stats.activeSubscriptions} subscriptions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} FLOW</div>
                <p className="text-xs text-muted-foreground">All-time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Address</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono font-bold truncate">{user?.addr}</div>
                <p className="text-xs text-muted-foreground">Provider ID</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Subscribers</CardTitle>
              <CardDescription>Users who are subscribed to your service</CardDescription>
            </CardHeader>
            <CardContent>
              {providerSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No subscribers yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your wallet address with potential subscribers:
                  </p>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm mb-4">
                    {user?.addr}
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">View Subscriber Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {providerSubscriptions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        <div className="font-semibold font-mono text-sm">{sub.subscriber}</div>
                        <div className="text-sm text-muted-foreground">
                          Subscribes every {Math.round(sub.interval / 86400)} days
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-primary">{sub.amount} FLOW</div>
                          <div className="text-xs text-muted-foreground">per payment</div>
                        </div>
                        {sub.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Cancelled</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Track Payments</h4>
                    <p className="text-sm text-muted-foreground">
                      View your payment history and upcoming scheduled payments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Grow Your Base</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your provider address to get more subscribers
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
