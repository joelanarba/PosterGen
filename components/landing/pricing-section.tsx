import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PosterGen",
    features: [
      "5 poster generations per month",
      "Standard quality exports",
      "Basic templates",
      "Watermarked downloads",
      "Community support",
    ],
    cta: "Get Started",
    href: "/generator",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For individuals and small teams",
    features: [
      "100 poster generations per month",
      "HD quality exports",
      "All premium templates",
      "No watermarks",
      "Priority support",
      "Custom branding",
      "Social media sharing",
    ],
    cta: "Start Pro Trial",
    href: "/pricing",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For agencies and enterprises",
    features: [
      "Unlimited generations",
      "4K quality exports",
      "Custom template creation",
      "API access",
      "Team collaboration",
      "Dedicated support",
      "White-label options",
      "Analytics dashboard",
    ],
    cta: "Contact Sales",
    href: "/pricing",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">Start free and upgrade as you grow. No hidden fees.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl border ${
                plan.popular ? "border-primary bg-card shadow-xl" : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-4 top-4">
                  <Badge className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
