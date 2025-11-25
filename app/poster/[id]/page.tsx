"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePosterStorage, type Poster } from "@/lib/poster-storage"
import { Navbar } from "@/components/landing/navbar"
import { Download, Sparkles, ArrowLeft, Twitter, Facebook, Linkedin, Link2 } from "lucide-react"
import { toast } from "sonner"

export default function PosterViewPage() {
  const params = useParams()
  const { posters } = usePosterStorage()
  const [poster, setPoster] = useState<Poster | null>(null)

  useEffect(() => {
    const found = posters.find((p) => p.id === params.id)
    if (found) {
      setPoster(found)
    }
  }, [params.id, posters])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this poster I created with PosterGen: ${poster?.title}`)

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400")
  }

  if (!poster) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="py-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Poster Not Found</h2>
              <p className="mt-2 text-muted-foreground">This poster may have been deleted or the link is invalid.</p>
              <Button asChild className="mt-6">
                <Link href="/generator">Create Your Own</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Poster Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={poster.imageUrl || "/placeholder.svg"}
                  alt={poster.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Details & Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">{poster.eventType}</Badge>
                <h1 className="text-2xl font-bold">{poster.title}</h1>
                {poster.description && <p className="mt-2 text-muted-foreground">{poster.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>Style: {poster.style}</span>
                  <span>•</span>
                  <span>Size: {poster.size}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Created {new Date(poster.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 font-semibold">Download</h3>
                <div className="space-y-2">
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download PNG (HD)
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 font-semibold">Share</h3>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-full bg-transparent"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-full bg-transparent"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-full bg-transparent"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-full bg-transparent" onClick={handleCopyLink}>
                    <Link2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-2 font-medium">Create your own poster</p>
                <p className="text-sm text-muted-foreground">Generate stunning event posters with AI</p>
                <Button asChild className="mt-4 w-full">
                  <Link href="/generator">Try PosterGen Free</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
