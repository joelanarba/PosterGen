import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

const PRICES = {
  pro: {
    monthly: 1200, // $12.00 in cents
    yearly: 9900, // $99.00 in cents
  },
  business: {
    monthly: 4900, // $49.00 in cents
    yearly: 39900, // $399.00 in cents
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, isYearly, userId, email } = body

    if (!planId || planId === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const priceData = PRICES[planId as keyof typeof PRICES]
    if (!priceData) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const amount = isYearly ? priceData.yearly : priceData.monthly
    const interval = isYearly ? "year" : "month"

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `PosterGen ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
              description: `${isYearly ? "Yearly" : "Monthly"} subscription to PosterGen ${planId} features`,
            },
            unit_amount: amount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId,
        billing: isYearly ? "yearly" : "monthly",
      },
      success_url: `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
