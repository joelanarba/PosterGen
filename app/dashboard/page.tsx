"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { usePosterStorage } from "@/lib/poster-storage"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PosterGrid } from "@/components/dashboard/poster-grid"
import { Plus, Sparkles, Zap, History, Crown, Gift } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { getPostersByUser } = usePosterStorage()
  const router = useRouter()

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

  const userPosters = getPostersByUser(user.id)
  const planLimits = {
    free: { credits: 5, label: "Free" },
    pro: { credits: 100, label: "Pro" },
    business: { credits: Number.POSITIVE_INFINITY, label: "Business" },
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="mt-1 text-muted-foreground">Create stunning posters for your events</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.isAdmin || user.plan === "business" ? "Unlimited" : user.credits}</div>
              <p className="text-xs text-muted-foreground">
                {user.isAdmin ? "Admin Access" : (user.plan === "free" ? "of 5 free credits" : `${planLimits[user.plan].label} plan`)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posters Created</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPosters.length}</div>
              <p className="text-xs text-muted-foreground">Total creations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Crown className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold capitalize">{user.plan}</span>
                {user.plan === "free" && (
                  <Badge variant="secondary" className="text-xs">
                    Upgrade
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.plan === "free" ? "Limited features" : "Full access"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <History className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  userPosters.filter((p) => {
                    const created = new Date(p.createdAt)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Posters this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Banner - Added referral promotion banner */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Invite Friends, Earn Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Get 5 free credits for every friend who joins and creates a poster
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/referrals">Invite Friends</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            {user.plan === "free" && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/generator" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create New Poster</h3>
                    <p className="text-sm text-muted-foreground">Generate with AI</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/templates" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Templates</h3>
                    <p className="text-sm text-muted-foreground">Start from a design</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/history" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/80">
                    <History className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View History</h3>
                    <p className="text-sm text-muted-foreground">Past creations</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/referrals" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-200">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Referral Program</h3>
                    <p className="text-sm text-muted-foreground">Earn free credits</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Posters */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Creations</h2>
            {userPosters.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history">View All</Link>
              </Button>
            )}
          </div>
          <div className="mt-4">
            {userPosters.length > 0 ? (
              <PosterGrid posters={userPosters.slice(0, 6)} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="mb-2">No posters yet</CardTitle>
                  <CardDescription className="mb-4">Create your first AI-generated poster in seconds</CardDescription>
                  <Button asChild>
                    <Link href="/generator">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Poster
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
