import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req) {
  try {
    const { ticketId, email } = await req.json();
    const t = await prisma.ticket.findUnique({
      where: { ticketId },
      include: { comments: { orderBy: { createdAt: 'asc' } } },
    });
    if (!t || t.email.toLowerCase() !== String(email || '').toLowerCase()) {
      return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, ticket: t });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}