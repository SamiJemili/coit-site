// app/api/admin/tickets/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { comments: { orderBy: { createdAt: 'asc' } } }
  })
  return NextResponse.json({ ok:true, tickets })
}
