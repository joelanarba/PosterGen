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

          {/* Text Overlay - Always visible to simulate poster text */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6">
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-white/90 drop-shadow-md">
                {poster.eventType}
              </p>
              <h3 className="font-heading text-2xl font-bold leading-tight text-white drop-shadow-lg">
                {poster.title}
              </h3>
              {/* We could add date/venue here if we saved it in the poster object */}
            </div>
          </div>

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Content for Hover State (Date/Details) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
             <p className="text-xs text-white/80 text-center">Created: {new Date(poster.createdAt).toLocaleDateString()}</p>
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
