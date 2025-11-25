import { MessageSquare, Wand2, Download } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Event",
    description:
      "Tell us about your event - the type, theme, date, venue, and any specific details you want to include.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI Creates Designs",
    description:
      "Our AI generates multiple unique poster designs based on your description. Pick your favorite or generate more.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Share",
    description: "Customize if needed, then download in high resolution or share directly to social media.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Create Posters in 3 Simple Steps</h2>
          <p className="text-lg text-muted-foreground">No design experience needed. Just describe and create.</p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/50 via-primary to-primary/50 lg:block" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step indicator */}
                <div className="mb-6 flex items-center gap-4 lg:flex-col lg:text-center">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card text-sm font-bold shadow-md">
                      {step.number}
                    </span>
                  </div>
                </div>
                <div className="lg:text-center">
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
