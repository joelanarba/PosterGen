"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminTestPage() {
  const { user, firebaseUser } = useAuth()
  const [status, setStatus] = useState("")

  const promoteMe = async () => {
    try {
      setStatus("Promoting...")
      if (!firebaseUser) throw new Error("Not authenticated")
      const token = await firebaseUser.getIdToken()
      const res = await fetch("/api/admin/promote-me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      setStatus(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setStatus("Error: " + e.message)
    }
  }

  const testGenerate = async () => {
    try {
      setStatus("Generating...")
      if (!firebaseUser) throw new Error("Not authenticated")
      const token = await firebaseUser.getIdToken()
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: "Admin Test",
          eventType: "Test",
          description: "Testing admin credits",
          style: "Minimalist",
          size: "Instagram Story"
        })
      })
      const data = await res.json()
      setStatus(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setStatus("Error: " + e.message)
    }
  }

  if (!user) return <div className="p-8">Please log in first.</div>

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={promoteMe}>Promote to Admin</Button>
            <Button onClick={testGenerate} variant="secondary">Test Generation</Button>
          </div>
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto max-h-[500px]">
            {status}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
