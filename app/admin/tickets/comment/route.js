// app/api/admin/tickets/comment/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req){
  const { ticketId, body } = await req.json()
  await prisma.comment.create({ data: { ticketId, author:'ADMIN', body:String(body||'') } })
  return NextResponse.json({ ok:true })
}
