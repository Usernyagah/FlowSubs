"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useFlowWallet } from "@/hooks/useFlowWallet"
import { useFlowSubs } from "@/hooks/useFlowSubs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, CheckCircle2, Building2 } from "lucide-react"

export default function RegisterProviderPage() {
  const { connected, connecting, error: walletError, connect } = useFlowWallet()
  const { registerProvider, loading: contractLoading, error: contractError } = useFlowSubs()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await registerProvider(formData.name, formData.description)

      if (result.status === 'SEALED') {
        toast({
          title: "Provider Registered!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 w-4 text-primary" />
              <span>You're now registered as a service provider.</span>
            </div>
          ),
        })

        // Reset form and redirect
        setFormData({ name: "", description: "" })
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        throw new Error(result.error || 'Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error registering as a provider. Please try again.",
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

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to register as a provider.</p>
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
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Register as Provider</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Become a service provider and start receiving recurring payments from subscribers.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Provider Details</CardTitle>
              <CardDescription>Enter your business or service information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Business or Service Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={50}
                  />
                  <p className="text-sm text-muted-foreground">The name subscribers will see</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service or offering..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    maxLength={200}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Brief description of what you offer ({formData.description.length}/200)
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Important Information
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Your wallet address will be your provider ID</li>
                      <li>Subscribers will send payments to your connected wallet</li>
                      <li>You can update your information later</li>
                      <li>Registration requires a blockchain transaction</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={isLoading || contractLoading}
                >
                  {isLoading || contractLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Provider...
                    </>
                  ) : (
                    "Register as Provider"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>After registration, share your wallet address with potential subscribers</li>
                <li>Subscribers can create subscriptions to your address</li>
                <li>Receive automatic recurring payments directly to your wallet</li>
                <li>Track your subscribers from the dashboard</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
