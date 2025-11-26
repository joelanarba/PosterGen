import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      // Allow calling from browser if we can get the token, but for GET requests from browser
      // it's harder to pass the header. 
      // Let's assume the user will use a tool or we'll provide a simple client-side button.
      // For now, let's stick to the standard pattern: expect a Bearer token.
      return NextResponse.json({ error: "Unauthorized - Missing Bearer Token" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // 2. Update User to Admin
    const userRef = adminDb.collection("users").doc(userId)
    await userRef.update({
      isAdmin: true
    })

    return NextResponse.json({ 
      success: true, 
      message: `User ${userId} promoted to admin.`,
      isAdmin: true
    })

  } catch (error: any) {
    console.error("Promotion error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
