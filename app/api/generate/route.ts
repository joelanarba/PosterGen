import { NextResponse } from "next/server"
import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // 2. Parse Request Body
    const body = await request.json()
    const { title, eventType, description, style, size } = body

    if (!title || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 3. Check User Credits & Plan
    const userRef = adminDb.collection("users").doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()
    const isFreePlan = userData?.plan === "free"
    const credits = userData?.credits || 0
    const isAdmin = userData?.isAdmin === true

    if (!isAdmin && isFreePlan && credits <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 })
    }

    // 4. Generate Image
    const apiKey = process.env.HUGGINGFACE_API_KEY
    let imageUrl = ""
    let storagePath = ""

    // Helper to get default prompt based on event type
    const getDefaultPrompt = (type: string) => {
      const prompts: Record<string, string> = {
        "Church Service": "elegant church service poster with cross and light rays",
        Wedding: "romantic wedding invitation with floral elements gold accents",
        "Birthday Party": "colorful birthday celebration poster with balloons confetti",
        "Business Conference": "professional corporate conference poster modern design",
        "Funeral/Memorial": "peaceful memorial service poster soft blue tones dove",
        "Seminar/Workshop": "educational seminar poster professional clean layout",
        "Concert/Music Event": "dynamic concert poster with music notes stage lights",
        "Charity Event": "heartfelt charity event poster community helping hands",
        "Sports Event": "energetic sports event poster dynamic action theme",
        "Holiday Celebration": "festive holiday celebration poster seasonal decorations",
      }
      return prompts[type] || "professional event poster design"
    }

    const query = getDefaultPrompt(eventType)

    if (apiKey) {
      const { HfInference } = await import("@huggingface/inference")
      const hf = new HfInference(apiKey)

      // We explicitly ask for NO text because SDXL struggles with text.
      // We rely on our CSS overlay for the typography.
      const prompt = `background art for a ${style} poster about ${eventType}, ${description || query}. minimalistic, high quality, professional graphic design, 8k resolution, highly detailed, clean composition, negative space for text.`

      // Use SDXL for high quality free generation
      let imageBlob: any;
      try {
        imageBlob = await hf.textToImage({
          model: "stabilityai/stable-diffusion-xl-base-1.0",
          inputs: prompt,
          parameters: {
            negative_prompt: "text, letters, typography, words, writing, watermark, signature, blurry, low quality, distorted, ugly, bad anatomy, busy, cluttered",
          }
        })
      } catch (hfError: any) {
        console.error("Hugging Face API Error:", hfError)
        return NextResponse.json({ error: `AI Generation Failed: ${hfError.message}` }, { status: 502 })
      }

      // 5. Upload to Firebase Storage
      const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      const fileName = `posters/${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.png`
      const file = bucket.file(fileName)
      
      // Cast to any first to avoid TS issues if types are mismatched in this environment
      const blob = imageBlob as unknown as Blob
      const arrayBuffer = await blob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      await file.save(buffer, {
        metadata: {
          contentType: 'image/png',
        },
      })

      await file.makePublic()
      imageUrl = file.publicUrl()
      storagePath = fileName
    } else {
      // Fallback to mock if no API key
      console.warn("No Hugging Face API Key found. Using mock generation.")
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate delay
      imageUrl = `https://placehold.co/1080x1920/png?text=${encodeURIComponent(title)}`
    }

    // 6. Deduct Credits (if free plan and not admin)
    if (!isAdmin && isFreePlan) {
      await userRef.update({
        credits: FieldValue.increment(-1),
        totalGenerations: FieldValue.increment(1)
      })
    } else {
      await userRef.update({
        totalGenerations: FieldValue.increment(1)
      })
    }

    // 7. Save Poster to Firestore
    const posterData = {
      userId,
      title,
      prompt: description || query,
      imageUrl,
      storagePath, // Save path for deletion later
      style,
      size: {
        width: 1080,
        height: 1920,
        preset: size
      },
      status: "completed",
      metadata: {
        eventType,
        model: apiKey ? "sdxl-base-1.0" : "mock-sdxl"
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const posterRef = await adminDb.collection("posters").add(posterData)

    return NextResponse.json({ 
      success: true, 
      posterId: posterRef.id, 
      imageUrl,
      creditsRemaining: isAdmin ? "unlimited" : (isFreePlan ? credits - 1 : "unlimited")
    })

  } catch (error: any) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
