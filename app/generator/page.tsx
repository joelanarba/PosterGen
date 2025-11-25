"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Loader2, RefreshCw, Wand2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const eventTypes = [
  "Church Service",
  "Wedding",
  "Birthday Party",
  "Business Conference",
  "Funeral/Memorial",
  "Seminar/Workshop",
  "Concert/Music Event",
  "Charity Event",
  "Sports Event",
  "Holiday Celebration",
]

const styles = [
  { id: "modern", label: "Modern & Clean", preview: "/modern-minimal-poster-design.jpg" },
  { id: "elegant", label: "Elegant & Classic", preview: "/elegant-classic-poster-design.jpg" },
  { id: "vibrant", label: "Vibrant & Bold", preview: "/vibrant-colorful-poster-design.jpg" },
  { id: "minimal", label: "Minimalist", preview: "/minimalist-poster-design.jpg" },
  { id: "playful", label: "Playful & Fun", preview: "/playful-fun-poster-design.jpg" },
  { id: "professional", label: "Professional", preview: "/professional-corporate-poster-design.jpg" },
]

const sizes = [
  { id: "poster", label: "Poster (A3)", dimensions: "297 × 420 mm" },
  { id: "flyer", label: "Flyer (A5)", dimensions: "148 × 210 mm" },
  { id: "social", label: "Social Media", dimensions: "1080 × 1080 px" },
  { id: "story", label: "Story/Reel", dimensions: "1080 × 1920 px" },
  { id: "banner", label: "Banner", dimensions: "1200 × 628 px" },
]

// Simulated poster images based on event type
const getGeneratedPosterUrl = (eventType: string, style: string) => {
  const queries: Record<string, string> = {
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
  const query = queries[eventType] || "professional event poster design"
  return `/placeholder.svg?height=600&width=450&query=${encodeURIComponent(query + " " + style + " style")}`
}

export default function GeneratorPage() {
  const { user, firebaseUser, isLoading: authLoading, updateUser } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [venue, setVenue] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("modern")
  const [selectedSize, setSelectedSize] = useState("poster")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const canGenerate = user.plan !== "free" || user.credits > 0

  const handleGenerate = async () => {
    if (!title || !eventType) {
      toast.error("Please fill in the event title and type")
      return
    }

    if (!canGenerate) {
      toast.error("No credits remaining. Please upgrade your plan.")
      return
    }

    setIsGenerating(true)
    setGeneratedPoster(null)

    try {
      if (!firebaseUser) throw new Error("Not authenticated")
      const token = await firebaseUser.getIdToken()

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          eventType,
          style: selectedStyle,
          size: selectedSize,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setGeneratedPoster(data.imageUrl)
      toast.success("Poster generated and saved!")
      
      // Update local user credits if returned
      if (data.creditsRemaining !== undefined && data.creditsRemaining !== "unlimited") {
        updateUser({ credits: data.creditsRemaining })
      }

    } catch (error: any) {
      console.error("Generation error:", error)
      toast.error(error.message || "Failed to generate poster")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Poster</h1>
            <p className="text-muted-foreground">Generate a stunning poster with AI</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Credits indicator */}
            {user.plan === "free" && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">{user.credits} credits remaining</span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/pricing">Get More</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Tell us about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Annual Youth Conference 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <Input id="date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      placeholder="e.g., City Convention Center"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any specific details, speakers, theme, colors you want..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Design Options</CardTitle>
                <CardDescription>Choose your poster style and size</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="style">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="size">Size</TabsTrigger>
                  </TabsList>
                  <TabsContent value="style" className="mt-4">
                    <div className="grid grid-cols-3 gap-3">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`overflow-hidden rounded-lg border-2 p-2 transition-all ${
                            selectedStyle === style.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="aspect-[4/5] overflow-hidden rounded bg-muted">
                            <img
                              src={style.preview || "/placeholder.svg"}
                              alt={style.label}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 text-xs font-medium">{style.label}</p>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="size" className="mt-4">
                    <div className="grid gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-all ${
                            selectedSize === size.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium">{size.label}</span>
                          <Badge variant="secondary">{size.dimensions}</Badge>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full gap-2" onClick={handleGenerate} disabled={isGenerating || !canGenerate}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Poster
                </>
              )}
            </Button>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your AI-generated poster will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  {isGenerating ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                        <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Creating your poster...</p>
                        <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
                      </div>
                    </div>
                  ) : generatedPoster ? (
                    <img
                      src={generatedPoster || "/placeholder.svg"}
                      alt="Generated poster"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">No poster yet</p>
                        <p className="text-sm text-muted-foreground">Fill in the details and click Generate</p>
                      </div>
                    </div>
                  )}
                </div>

                {generatedPoster && !isGenerating && (
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 gap-2" asChild>
                      <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent" onClick={handleRegenerate}>
                      <RefreshCw className="h-4 w-4" />
                      Generate Another
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
