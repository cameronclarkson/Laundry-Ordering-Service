import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Dynamically import Stripe to avoid module resolution issues
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })

    const { amount, email, offer } = await request.json()
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Calculate hold amount: estimate + $10 (amount is in cents)
    const holdAmount = amount + 1000

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: holdAmount,
      currency: 'usd',
      receipt_email: email,
      metadata: offer ? { offer } : undefined,
      description: offer ? `Special Offer: ${offer}` : 'Laundry Service Order',
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
} 