// app/api/tickets/comment/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req) {
  try {
    const { ticketId, email, body } = await req.json()
    const t = await prisma.ticket.findUnique({ where: { ticketId } })
    if (!t || t.email.toLowerCase() !== String(email || '').toLowerCase()) {
      return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
    }
    await prisma.comment.create({
      data: { ticketId, author: 'CLIENT', body: String(body || '') },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}
