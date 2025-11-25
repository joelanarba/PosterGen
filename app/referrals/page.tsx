"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Copy, Gift, Share2, Users, Zap } from "lucide-react"
import { toast } from "sonner"

export default function ReferralsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [referralStats] = useState({
    totalReferrals: 3,
    creditsEarned: 15,
    pendingReferrals: 1,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const referralCode = `POSTER-${user.id.slice(0, 8).toUpperCase()}`
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      toast.success("Referral code copied!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success("Referral link copied!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join PosterGen",
        text: "Create stunning event posters with AI! Use my referral link to get 5 free credits.",
        url: referralLink,
      })
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Referral Program</h1>
            <p className="text-muted-foreground">Invite friends and earn free credits</p>
          </div>
        </div>

        {/* Hero Banner */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Give 5, Get 5</h2>
                <p className="mt-2 max-w-md text-white/90">
                  Invite your friends to PosterGen. They get 5 free credits when they sign up, and you get 5 credits
                  when they create their first poster!
                </p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                <Gift className="h-12 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">Friends joined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats.creditsEarned}</div>
              <p className="text-xs text-muted-foreground">From referrals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats.pendingReferrals}</div>
              <p className="text-xs text-muted-foreground">Awaiting first poster</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code & Link */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>Share this code with friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={referralCode} readOnly className="font-mono text-lg font-bold" />
                <Button variant="outline" size="icon" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Direct link to share</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button className="mt-4 w-full gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share with Friends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold">Share Your Link</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send your unique referral link to friends via email, social media, or text.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold">Friends Sign Up</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  When they create an account using your link, they get 5 free credits.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold">You Earn Credits</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once they create their first poster, you receive 5 bonus credits!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Referrals */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>Friends who signed up with your link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <span className="font-medium text-green-600">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">john.d***@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Joined Nov 20, 2025</p>
                  </div>
                </div>
                <Badge variant="default">+5 credits</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <span className="font-medium text-green-600">SM</span>
                  </div>
                  <div>
                    <p className="font-medium">sarah.m***@outlook.com</p>
                    <p className="text-sm text-muted-foreground">Joined Nov 18, 2025</p>
                  </div>
                </div>
                <Badge variant="default">+5 credits</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <span className="font-medium text-yellow-600">MK</span>
                  </div>
                  <div>
                    <p className="font-medium">mike.k***@yahoo.com</p>
                    <p className="text-sm text-muted-foreground">Joined Nov 24, 2025</p>
                  </div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
