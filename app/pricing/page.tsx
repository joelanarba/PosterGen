"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { useAuth } from "@/lib/auth-context"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for trying out PosterGen",
    features: [
      "5 poster generations per month",
      "Standard quality exports",
      "Basic templates",
      "Watermarked downloads",
      "Community support",
    ],
    priceId: null,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 12,
    yearlyPrice: 99,
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
    priceIdMonthly: "price_pro_monthly",
    priceIdYearly: "price_pro_yearly",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 49,
    yearlyPrice: 399,
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
    priceIdMonthly: "price_business_monthly",
    priceIdYearly: "price_business_yearly",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/signup")
      }
      return
    }

    if (!user) {
      toast.info("Please sign in to subscribe")
      router.push("/login")
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          isYearly,
          userId: user.id,
          email: user.email,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error("Failed to create checkout session")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Pricing
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <Label htmlFor="billing-toggle" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
                Monthly
              </Label>
              <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
              <Label htmlFor="billing-toggle" className={isYearly ? "font-medium" : "text-muted-foreground"}>
                Yearly
                <Badge variant="secondary" className="ml-2">
                  Save 30%
                </Badge>
              </Label>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
              const isCurrentPlan = user?.plan === plan.id

              return (
                <Card
                  key={plan.id}
                  className={`relative ${plan.popular ? "border-primary shadow-xl" : "border-border"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1 px-3 py-1">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${price}</span>
                      {plan.id !== "free" && (
                        <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      disabled={isCurrentPlan || loadingPlan === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {loadingPlan === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : plan.id === "free" ? (
                        "Get Started"
                      ) : (
                        `Subscribe to ${plan.name}`
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until
                    the end of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens when I run out of credits?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    On the Free plan, you'll need to wait until the next month for your credits to reset, or upgrade to
                    a paid plan. Pro and Business plans have higher limits or unlimited generations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 14-day money-back guarantee. If you're not satisfied with your subscription, contact us
                    within 14 days for a full refund.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I switch between plans?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the
                    prorated difference. When downgrading, the change takes effect at the next billing cycle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
