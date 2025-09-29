import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "next-auth"
import { prisma } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req){
  const session = await auth()
  const user = session?.user
  if(!user) return NextResponse.json({ok:false}, {status:401})

  const formData = await req.formData()
  const ticketId = Number(formData.get("ticketId"))
  const amount = Number(formData.get("amount") || 15000) // 150$ CAD

  const t = await prisma.ticket.findFirst({ where: { id: ticketId, userId: user.id } })
  if(!t) return NextResponse.json({ok:false}, {status:404})

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: process.env.CURRENCY || "cad",
    line_items: [
      { price_data: { currency: process.env.CURRENCY || "cad", product_data: { name: `Analyse ticket ${t.ticketId}` }, unit_amount: amount }, quantity: 1 }
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?paid=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=1`,
    metadata: { app_ticket_id: String(t.id) }
  })

  await prisma.payment.create({
    data: { ticketId: t.id, amount, currency: process.env.CURRENCY || "cad", status: "PENDING", stripeSessionId: checkout.id }
  })

  return NextResponse.redirect(checkout.url, 303)
}
