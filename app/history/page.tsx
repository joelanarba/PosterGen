"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PosterGrid } from "@/components/dashboard/poster-grid"
import { useAuth } from "@/lib/auth-context"
import { usePosterStorage } from "@/lib/poster-storage"
import { ArrowLeft, Plus, Sparkles } from "lucide-react"

export default function HistoryPage() {
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

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your Creations</h1>
              <p className="text-muted-foreground">{userPosters.length} posters created</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/generator">
              <Plus className="mr-2 h-4 w-4" />
              New Poster
            </Link>
          </Button>
        </div>

        {userPosters.length > 0 ? (
          <PosterGrid posters={userPosters} />
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">No posters yet</CardTitle>
              <CardDescription className="mb-6 max-w-sm">
                You haven't created any posters yet. Start generating amazing designs with AI.
              </CardDescription>
              <Button asChild>
                <Link href="/generator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Poster
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
