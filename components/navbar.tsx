"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useFlowWallet } from "@/hooks/useFlowWallet"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const { connected, connect, disconnect, user, connecting, error } = useFlowWallet()

  const isActive = (path: string) => pathname === path

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold">FlowSubs</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/subscribe"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/subscribe") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Subscribe
            </Link>

            <ThemeToggle />

            {connecting ? (
              <Button disabled size="sm" variant="outline">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </Button>
            ) : error ? (
              <Button disabled size="sm" variant="destructive">
                Connection Error
              </Button>
            ) : connected ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground font-mono">
                  {user?.addr?.slice(0, 6)}...{user?.addr?.slice(-4)}
                </div>
                <Button onClick={disconnect} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} size="sm">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
