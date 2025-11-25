import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Pastor Michael Johnson",
    role: "Grace Community Church",
    image: "/professional-pastor-portrait.png",
    content:
      "PosterGen has transformed how we promote our church events. What used to take hours now takes minutes. The AI understands exactly what we need.",
  },
  {
    name: "Sarah Chen",
    role: "Event Planner",
    image: "/professional-woman-portrait.png",
    content:
      "I use PosterGen for all my clients' events. From weddings to corporate galas, the quality is consistently impressive. My clients love the results!",
  },
  {
    name: "David Okonkwo",
    role: "Small Business Owner",
    image: "/professional-businessman-portrait.png",
    content:
      "As a small business owner, I can't afford a designer for every promotion. PosterGen gives me professional results at a fraction of the cost.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Loved by Thousands of Creators</h2>
          <p className="text-lg text-muted-foreground">
            See what our users have to say about their experience with PosterGen.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">{`"${testimonial.content}"`}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
