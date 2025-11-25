import { Sparkles, Zap, Palette, Download, Share2, Clock, Layers, Wand2 } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Describe your event and let AI create stunning poster designs tailored to your needs.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional posters in under 30 seconds. No design skills required.",
  },
  {
    icon: Palette,
    title: "Customizable Styles",
    description: "Choose from multiple design styles - modern, elegant, playful, professional, and more.",
  },
  {
    icon: Layers,
    title: "Multiple Formats",
    description: "Create posters, flyers, social media posts, and invitations in various sizes.",
  },
  {
    icon: Wand2,
    title: "Smart Editing",
    description: "Fine-tune colors, fonts, and layouts with our intuitive editing tools.",
  },
  {
    icon: Download,
    title: "HD Downloads",
    description: "Export in high resolution PNG, JPG, or PDF formats ready for print.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share directly to social media or generate shareable links instantly.",
  },
  {
    icon: Clock,
    title: "History & Drafts",
    description: "Access all your creations anytime. Save drafts and continue later.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Create Amazing Posters
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that make poster creation effortless for everyone.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
