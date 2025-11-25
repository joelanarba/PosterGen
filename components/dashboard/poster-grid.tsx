"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePosterStorage, type Poster } from "@/lib/poster-storage"
import { Download, MoreVertical, Share2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface PosterGridProps {
  posters: Poster[]
}

export function PosterGrid({ posters }: PosterGridProps) {
  const { deletePoster } = usePosterStorage()

  const handleDelete = (id: string) => {
    deletePoster(id)
    toast.success("Poster deleted")
  }

  const handleDownload = (poster: Poster) => {
    // In a real app, this would download the actual image
    toast.success("Download started")
  }

  const handleShare = async (poster: Poster) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/poster/${poster.id}`)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posters.map((poster) => (
        <div
          key={poster.id}
          className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={poster.imageUrl || "/placeholder.svg"}
              alt={poster.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Badge variant="secondary" className="mb-2">
              {poster.eventType}
            </Badge>
            <h3 className="font-semibold">{poster.title}</h3>
            <p className="text-sm text-white/80">{new Date(poster.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Actions */}
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload(poster)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare(poster)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(poster.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
