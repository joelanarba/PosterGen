"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Search, Sparkles } from "lucide-react"

const categories = [
  "All",
  "Church",
  "Business",
  "Wedding",
  "Birthday",
  "Funeral",
  "Conference",
  "Party",
  "Sports",
  "Holiday",
]

const templates = [
  {
    id: 1,
    title: "Sunday Worship",
    category: "Church",
    image: "/modern-church-sunday-service-poster-with-warm-colo.jpg",
    premium: false,
  },
  {
    id: 2,
    title: "Corporate Summit",
    category: "Business",
    image: "/professional-corporate-event-poster-blue-theme.jpg",
    premium: true,
  },
  {
    id: 3,
    title: "Elegant Wedding",
    category: "Wedding",
    image: "/elegant-wedding-invitation-poster-gold-and-white.jpg",
    premium: true,
  },
  {
    id: 4,
    title: "Kids Birthday",
    category: "Birthday",
    image: "/colorful-kids-birthday-party-poster-balloons.jpg",
    premium: false,
  },
  {
    id: 5,
    title: "Memorial Service",
    category: "Funeral",
    image: "/peaceful-memorial-service-poster-soft-blue.jpg",
    premium: false,
  },
  {
    id: 6,
    title: "Tech Conference",
    category: "Conference",
    image: "/modern-tech-conference-poster-geometric-design.jpg",
    premium: true,
  },
  {
    id: 7,
    title: "Youth Night",
    category: "Church",
    image: "/vibrant-youth-night-church-event-poster.jpg",
    premium: false,
  },
  {
    id: 8,
    title: "Summer Party",
    category: "Party",
    image: "/tropical-summer-party-poster-bright-colors.jpg",
    premium: false,
  },
  {
    id: 9,
    title: "Church Revival",
    category: "Church",
    image: "/professional-church-event-poster-with-modern-desig.jpg",
    premium: true,
  },
  { id: 10, title: "Modern Minimal", category: "Business", image: "/modern-minimal-poster-design.jpg", premium: false },
  { id: 11, title: "Elegant Classic", category: "Wedding", image: "/elegant-classic-poster-design.jpg", premium: true },
  { id: 12, title: "Vibrant Event", category: "Party", image: "/vibrant-colorful-poster-design.jpg", premium: false },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === "All" || template.category === activeCategory
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Templates
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Browse Design Templates</h1>
            <p className="text-lg text-muted-foreground">
              Start with a professionally designed template and customize it with AI.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mb-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/generator?template=${template.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Premium Badge */}
                {template.premium && (
                  <div className="absolute right-3 top-3">
                    <Badge className="gap-1 bg-gradient-to-r from-primary to-accent">
                      <Sparkles className="h-3 w-3" />
                      Pro
                    </Badge>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Badge variant="secondary" className="mb-2">
                    {template.category}
                  </Badge>
                  <h3 className="font-semibold">{template.title}</h3>
                  <Button size="sm" className="mt-3 w-full">
                    Use Template
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-16 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-muted p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold">Can't find what you're looking for?</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Let our AI create a completely unique design tailored to your event.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/generator">Generate Custom Design</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
