"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import ColorThief from "colorthief"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Loader2, RefreshCw, Wand2, ArrowLeft, Upload, Image as ImageIcon, Palette, Save, Download } from "lucide-react"
import { toast } from "sonner"
import { toPng } from "html-to-image"
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, storage } from "@/lib/firebase-config"

const designCategories = [
  "Church Service",
  "Wedding",
  "Birthday Wish",
  "Political Campaign",
  "Business Conference",
  "Funeral/Memorial",
  "Seminar/Workshop",
  "Concert/Music Event",
  "Charity Event",
  "Sports Event",
  "Holiday Celebration",
  "Quote/Announcement",
  "Product Advertisement"
]

export default function GeneratorPage() {
  const { user, firebaseUser, isLoading: authLoading, updateUser } = useAuth()
  const router = useRouter()

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [venue, setVenue] = useState("")
  
  // Asset State
  const [subjectImage, setSubjectImage] = useState<string | null>(null)
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [manualColor, setManualColor] = useState("#000000") // Deprecated in favor of extractedColors[0]
  
  // Design State
  const [layout, setLayout] = useState("center")
  const [imageStyle, setImageStyle] = useState("fade")
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedBackground, setGeneratedBackground] = useState<string | null>(null)
  
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Color Extraction Logic
  const extractColors = (imageUrl: string) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = imageUrl
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 3)
        if (palette) {
          const hexColors = palette.map((rgb: number[]) => 
            `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`
          )
          setExtractedColors(hexColors)
          toast.success("Colors extracted!")
        }
      } catch (error) {
        console.error("Color extraction failed:", error)
      }
    }
  }

  // Dropzone for Subject Image
  const onDropSubject = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSubjectImage(url)
      setSubjectImage(url)
      // Note: We no longer extract colors from the subject image to avoid skin tones
    }
  }

  const { getRootProps: getSubjectProps, getInputProps: getSubjectInputProps } = useDropzone({
    onDrop: onDropSubject,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  // Dropzone for Logo
  const onDropLogo = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoImage(url)
      // Always prioritize logo for colors
      extractColors(url)
    }
  }

  const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({
    onDrop: onDropLogo,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  const canGenerate = user?.isAdmin || user?.plan !== "free" || (user?.credits || 0) > 0

  const handleGenerate = async () => {
    if (!title || !category) {
      toast.error("Please fill in the title and category")
      return
    }

    if (!canGenerate) {
      toast.error("No credits remaining. Please upgrade your plan.")
      return
    }

    setIsGenerating(true)
    setGeneratedBackground(null)

    try {
      if (!firebaseUser) throw new Error("Not authenticated")
      const token = await firebaseUser.getIdToken()

      // Construct prompt based on extracted colors if available
      let colorPrompt = ""
      if (extractedColors.length > 0) {
        colorPrompt = `color palette: ${extractedColors.join(", ")}`
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: `${description}. ${colorPrompt}`, // Inject colors into prompt
          eventType: category,
          style: "modern", // Default style for now
          size: "poster",
        }),
      })

      // Check content type to avoid parsing HTML error pages as JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
         const text = await response.text()
         console.error("API Error (Non-JSON):", text)
         throw new Error("Server error. Please check logs.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setGeneratedBackground(data.imageUrl)
      toast.success("Background generated!")
      
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

  const handleSave = async () => {
    if (!generatedBackground && !subjectImage) {
      toast.error("Nothing to save! Generate a design first.")
      return
    }

    if (!user) {
      toast.error("You must be logged in to save.")
      return
    }

    setIsSaving(true)
    try {
      // 1. Capture the preview as an image
      if (!previewRef.current) throw new Error("Preview element not found")
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2 // Higher quality
      })

      // 2. Upload to Firebase Storage
      const timestamp = Date.now()
      const storageRef = ref(storage, `posters/${user.id}/${timestamp}.png`)
      await uploadString(storageRef, dataUrl, 'data_url')
      const downloadUrl = await getDownloadURL(storageRef)

      // 3. Save metadata to Firestore
      await addDoc(collection(db, "posters"), {
        userId: user.id,
        title: title || "Untitled Poster",
        prompt: description, // Storing description as prompt context
        imageUrl: downloadUrl,
        thumbnailUrl: downloadUrl, // Using same URL for now, could generate smaller one
        size: {
          width: 1080, // Assuming standard poster ratio for now
          height: 1350,
          preset: "poster"
        },
        style: imageStyle,
        status: "completed",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          generationTime: Date.now(),
          model: "poster-gen-v1"
        }
      })

      toast.success("Poster saved successfully!")
      router.push("/history")

    } catch (error: any) {
      console.error("Save error:", error)
      toast.error("Failed to save poster: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
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
            <h1 className="text-2xl font-bold">Smart Design Studio</h1>
            <p className="text-muted-foreground">Upload your photos and let AI design around them</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Controls */}
          <div className="space-y-6">
            
            {/* 1. Upload Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  1. Upload Assets
                </CardTitle>
                <CardDescription>Upload your subject photo and logo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Image Upload */}
                <div>
                  <Label className="mb-2 block">Subject Image (Person/Product)</Label>
                  <div 
                    {...getSubjectProps()} 
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${subjectImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                  >
                    <input {...getSubjectInputProps()} />
                    {subjectImage ? (
                      <div className="relative h-32 w-full overflow-hidden rounded-md">
                        <img src={subjectImage} alt="Subject" className="h-full w-full object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <p className="text-sm font-medium text-white">Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <Label className="mb-2 block">Logo (Optional - Prioritized for Colors)</Label>
                  <div 
                    {...getLogoProps()} 
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${logoImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                  >
                    <input {...getLogoInputProps()} />
                    {logoImage ? (
                      <div className="relative h-16 w-full overflow-hidden rounded-md">
                        <img src={logoImage} alt="Logo" className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Upload Logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Colors & Manual Picker */}
                <div>
                  <Label className="mb-2 block">Brand Color Palette</Label>
                  <div className="flex flex-col gap-4 rounded-lg border p-4">
                    {extractedColors.length === 0 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Auto-generating colors based on theme</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setExtractedColors(["#000000", "#ffffff", "#808080"])}
                        >
                          Customize Colors
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-6">
                        {/* Primary Color */}
                        <div className="flex items-center gap-2">
                          <Label htmlFor="color-0" className="text-xs text-muted-foreground">Primary</Label>
                          <Input
                            id="color-0"
                            type="color"
                            value={extractedColors[0] || "#000000"}
                            onChange={(e) => {
                              const newColors = [...extractedColors]
                              newColors[0] = e.target.value
                              // Ensure we have 3 colors
                              if (!newColors[1]) newColors[1] = "#ffffff"
                              if (!newColors[2]) newColors[2] = "#808080"
                              setExtractedColors(newColors)
                            }}
                            className="h-8 w-12 p-1"
                          />
                        </div>

                        {/* Secondary Color */}
                        <div className="flex items-center gap-2">
                          <Label htmlFor="color-1" className="text-xs text-muted-foreground">Secondary</Label>
                          <Input
                            id="color-1"
                            type="color"
                            value={extractedColors[1] || "#ffffff"}
                            onChange={(e) => {
                              const newColors = [...extractedColors]
                              newColors[1] = e.target.value
                              setExtractedColors(newColors)
                            }}
                            className="h-8 w-12 p-1"
                          />
                        </div>

                        {/* Accent Color */}
                        <div className="flex items-center gap-2">
                          <Label htmlFor="color-2" className="text-xs text-muted-foreground">Accent</Label>
                          <Input
                            id="color-2"
                            type="color"
                            value={extractedColors[2] || "#808080"}
                            onChange={(e) => {
                              const newColors = [...extractedColors]
                              newColors[2] = e.target.value
                              setExtractedColors(newColors)
                            }}
                            className="h-8 w-12 p-1"
                          />
                        </div>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => setExtractedColors([])}
                          title="Reset to Auto"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {extractedColors.length === 0 
                        ? "Upload a logo to extract colors, or click Customize to pick manually." 
                        : "Customize your brand palette or reset to auto-generate."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Design Details */}
            <Card>
              <CardHeader>
                <CardTitle>2. Design Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Main Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Happy Birthday, Vote for Joel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {designCategories.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date (Optional)</Label>
                    <Input id="date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue / Subtitle (Optional)</Label>
                    <Input
                      id="venue"
                      placeholder="e.g., City Hall OR 'Age 25'"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Theme, special guests, specific wishes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3. Layout & Style */}
            <Card>
              <CardHeader>
                <CardTitle>3. Layout & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Composition Layout</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['center', 'left', 'right'].map((l) => (
                      <Button
                        key={l}
                        variant={layout === l ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => setLayout(l)}
                      >
                        {l}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image Blending</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['none', 'fade', 'circle'].map((s) => (
                      <Button
                        key={s}
                        variant={imageStyle === s ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => setImageStyle(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full gap-2" onClick={handleGenerate} disabled={isGenerating || !canGenerate}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Background...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Design
                </>
              )}
            </Button>
          </div>

          {/* Right: Smart Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>Smart composite of your assets and AI background</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted shadow-2xl">
                  {/* Layer 1: AI Background */}
                  {generatedBackground ? (
                    <img
                      src={generatedBackground}
                      alt="Background"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <p className="text-sm text-muted-foreground">AI Background will appear here</p>
                    </div>
                  )}

                  {/* Layer 2: Subject Image (Composited) */}
                  {subjectImage && (
                    <div 
                      className={`absolute transition-all duration-500
                        ${layout === 'center' ? 'bottom-0 left-1/2 h-[65%] w-[80%] -translate-x-1/2' : ''}
                        ${layout === 'left' ? 'bottom-0 left-0 h-[70%] w-[70%]' : ''}
                        ${layout === 'right' ? 'bottom-0 right-0 h-[70%] w-[70%]' : ''}
                      `}
                    >
                      <img 
                        src={subjectImage} 
                        alt="Subject" 
                        className={`h-full w-full object-cover object-top drop-shadow-2xl transition-all duration-500
                          ${imageStyle === 'fade' ? '[mask-image:linear-gradient(to_bottom,black_50%,transparent)]' : ''}
                          ${imageStyle === 'circle' ? 'rounded-full border-4 border-white/20' : ''}
                        `} 
                      />
                    </div>
                  )}

                  {/* Layer 3: Text Overlay (Dynamic Colors & Layout) */}
                  <div className={`absolute inset-0 flex flex-col p-8 transition-all duration-500
                    ${layout === 'center' ? 'items-center justify-between text-center' : ''}
                    ${layout === 'left' ? 'items-end justify-center text-right' : ''}
                    ${layout === 'right' ? 'items-start justify-center text-left' : ''}
                  `}>
                    {/* Top: Logo */}
                    <div className={`${layout === 'center' ? '' : 'absolute top-8'}`}>
                      {logoImage && (
                        <img src={logoImage} alt="Logo" className="h-16 w-auto object-contain drop-shadow-md" />
                      )}
                    </div>

                    {/* Typography */}
                    <div className="z-10">
                      <div 
                        className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
                        style={{ 
                          backgroundColor: extractedColors[0] || '#000', 
                          color: '#fff' 
                        }}
                      >
                        {category || "Category"}
                      </div>
                      <h1 
                        className="mt-4 font-heading text-4xl font-black leading-none tracking-tight drop-shadow-xl"
                        style={{ color: extractedColors[1] || '#fff' }}
                      >
                        {title || "YOUR TITLE HERE"}
                      </h1>
                      
                      {(eventDate || venue) && (
                        <div className={`mt-4 flex flex-col gap-1 text-sm font-medium text-white drop-shadow-md
                          ${layout === 'center' ? 'items-center' : ''}
                          ${layout === 'left' ? 'items-end' : ''}
                          ${layout === 'right' ? 'items-start' : ''}
                        `}>
                          {eventDate && <span>{new Date(eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>}
                          {venue && <span>{venue}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Overlay Gradient for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Actions */}
            <div className="mt-4 flex gap-4">
              <Button 
                size="lg" 
                className="w-full gap-2" 
                variant="secondary"
                onClick={handleSave}
                disabled={isSaving || (!generatedBackground && !subjectImage)}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save to Gallery
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
