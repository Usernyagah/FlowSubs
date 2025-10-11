"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Shield, Clock, Repeat } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Create recurring subscriptions in seconds with our intuitive interface.",
    },
    {
      icon: Shield,
      title: "Secure & Trustless",
      description: "Smart contracts ensure your subscriptions are executed automatically and securely.",
    },
    {
      icon: Clock,
      title: "Flexible Intervals",
      description: "Set custom payment intervals that work for your business model.",
    },
    {
      icon: Repeat,
      title: "Automated Payments",
      description: "Never miss a payment with blockchain-powered automation.",
    },
  ]

  const stats = [
    { value: "10K+", label: "Active Subscriptions" },
    { value: "$2M+", label: "Total Volume" },
    { value: "99.9%", label: "Uptime" },
    { value: "500+", label: "Providers" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            The complete platform for <span className="text-primary">blockchain subscriptions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
            Manage recurring payments on Flow blockchain. Securely build, deploy, and scale subscription-based services
            with smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/subscribe">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base">
              <Link href="/contract-testing">Test Contracts</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Built for the future of payments</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Leverage blockchain technology to create seamless subscription experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 h-full border-border bg-card hover:border-primary/50 transition-colors">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-12 text-center bg-card border-border">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Connect your wallet and create your first subscription in minutes.
            </p>
            <Button asChild size="lg">
              <Link href="/subscribe">
                Create Subscription
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
