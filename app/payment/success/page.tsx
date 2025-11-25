"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle, Loader2, Sparkles } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (sessionId && user) {
      // In a real app, verify the session with the backend
      // For demo, we'll simulate upgrading to pro
      setTimeout(() => {
        updateUser({
          plan: "pro",
          credits: 100,
        })
        setIsVerifying(false)
      }, 2000)
    } else {
      setIsVerifying(false)
    }
  }, [searchParams, user, updateUser])

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
            <p className="text-sm text-muted-foreground">This will only take a moment</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Welcome to PosterGen Pro! Your account has been upgraded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium">Pro Plan</span>
              </div>
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You now have 100 credits per month and access to all premium features.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/generator">Start Creating</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
