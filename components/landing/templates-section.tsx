"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Church", "Business", "Wedding", "Birthday", "Funeral", "Conference", "Party"]

const templates = [
  {
    id: 1,
    title: "Sunday Service",
    category: "Church",
    image: "/modern-church-sunday-service-poster-with-warm-colo.jpg",
  },
  {
    id: 2,
    title: "Corporate Event",
    category: "Business",
    image: "/professional-corporate-event-poster-blue-theme.jpg",
  },
  {
    id: 3,
    title: "Elegant Wedding",
    category: "Wedding",
    image: "/elegant-wedding-invitation-poster-gold-and-white.jpg",
  },
  {
    id: 4,
    title: "Kids Birthday",
    category: "Birthday",
    image: "/colorful-kids-birthday-party-poster-balloons.jpg",
  },
  {
    id: 5,
    title: "Memorial Service",
    category: "Funeral",
    image: "/peaceful-memorial-service-poster-soft-blue.jpg",
  },
  {
    id: 6,
    title: "Tech Conference",
    category: "Conference",
    image: "/modern-tech-conference-poster-geometric-design.jpg",
  },
  {
    id: 7,
    title: "Youth Night",
    category: "Church",
    image: "/vibrant-youth-night-church-event-poster.jpg",
  },
  {
    id: 8,
    title: "Summer Party",
    category: "Party",
    image: "/tropical-summer-party-poster-bright-colors.jpg",
  },
]

export function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredTemplates =
    activeCategory === "All" ? templates : templates.filter((t) => t.category === activeCategory)

  return (
    <section id="templates" className="bg-muted/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Templates for Every Occasion</h2>
          <p className="text-lg text-muted-foreground">
            Start with a template or let AI create something completely unique for you.
          </p>
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
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Badge variant="secondary" className="mb-2">
                  {template.category}
                </Badge>
                <h3 className="font-semibold">{template.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <a href="/generator">View All Templates</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
