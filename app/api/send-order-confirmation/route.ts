import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const { email, name, offer, price } = await request.json()
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Laundry Service <noreply@yourdomain.com>',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h2>Thank you for your order, ${name || 'Customer'}!</h2>
        <p>We received your order for: <strong>${offer}</strong></p>
        <p>Order total: <strong>$${price}</strong></p>
        <p>We'll be in touch soon to schedule your pickup.</p>
      `,
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Resend email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 