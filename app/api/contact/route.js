// app/api/contact/route.js
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { generateTicketId } from '@/lib/tickets'
import { prisma } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

function adminEmailHtml({ brand, logo, ticket, p }) {
  return `
  <html><body style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;color:#0f172a">
    <div style="max-width:640px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:12px">
        ${logo ? `<img src="${logo}" alt="${brand}" height="28"/>` : `<strong>${brand}</strong>`}
        <span style="font-size:14px;color:#334155">Nouvelle demande</span>
      </div>
      <div style="padding:20px">
        <p>Ticket: <span style="background:#e2f2ff;color:#0369a1;font-weight:700;border-radius:8px;padding:6px 10px">${ticket}</span></p>
        <p><b>Nom:</b> ${p.name || '-'}</p>
        <p><b>Email:</b> ${p.email || '-'}</p>
        <p><b>Téléphone:</b> ${p.phone || '-'}</p>
        <p><b>Type d’intervention:</b> ${p.mode || '-'}</p>
        <p><b>Message:</b><br>${(p.message || '').replace(/\n/g,'<br/>')}</p>
      </div>
      <div style="padding:14px 20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b">
        © ${new Date().getFullYear()} ${brand}
      </div>
    </div>
  </body></html>`
}

function clientEmailHtml({ brand, logo, ticket, p }) {
  return `
  <html><body style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;color:#0f172a">
    <div style="max-width:640px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:12px">
        ${logo ? `<img src="${logo}" alt="${brand}" height="28"/>` : `<strong>${brand}</strong>`}
        <span style="font-size:14px;color:#334155">Accusé de réception</span>
      </div>
      <div style="padding:20px">
        <p>Bonjour ${p.name || ''},</p>
        <p>Merci pour votre demande. Votre numéro de ticket est <b>${ticket}</b>.</p>
        <p>Nous revenons vers vous sous 24h ouvrées.</p>
        <p style="margin-top:20px">— ${brand}</p>
      </div>
      <div style="padding:14px 20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b">
        Vous pouvez répondre à cet email pour nous donner plus de détails.
      </div>
    </div>
  </body></html>`
}

function smtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export async function POST(req) {
  const debug = process.env.DEBUG_EMAIL === '1'
  try {
    const form = await req.formData()
    const p = Object.fromEntries(form.entries())

    const ticketId = generateTicketId('COT')
    const brand = process.env.BRAND_NAME || 'CoIT 360'
    const fromResend = `${brand} <${process.env.RESEND_FROM || 'onboarding@resend.dev'}>`
    const toInternal = process.env.CONTACT_TO
    const logo = process.env.LOGO_URL
    const bccClientToAdmin = process.env.BCC_CLIENT_TO_ADMIN === '1'

    // 1) Upsert User (client)
    const user = await prisma.user.upsert({
      where: { email: p.email || '' },
      update: { name: p.name || undefined },
      create: { email: p.email || '', name: p.name || null, role: 'CLIENT' }
    })

    // 2) Crée ticket + 1er commentaire lié au user
    const title =
      (p.message || '').split('\n')[0].slice(0, 80).trim() ||
      `Demande de ${p.name || 'client'}`
    await prisma.ticket.create({
      data: {
        ticketId,
        title,
        message: p.message || '',
        mode: p.mode || null,
        userId: user.id,
        comments: {
          create: [{ body: p.message || '', authorId: user.id }]
        }
      }
    })

    // 3) Emails
    if (!toInternal) {
      return NextResponse.json({ ok: false, error: 'Missing CONTACT_TO' }, { status: 500 })
    }

    // Admin → Resend si possible, sinon SMTP
    try {
      if (process.env.RESEND_API_KEY) {
        const r = await resend.emails.send({
          from: fromResend,
          to: [toInternal],
          subject: `🆕 Nouvelle demande — ${ticketId}`,
          html: adminEmailHtml({ brand, logo, ticket: ticketId, p }),
          reply_to: p.email || undefined,
        })
        if (debug) console.log('[email][admin][resend]:', r)
      } else {
        const t = smtpTransport()
        const info = await t.sendMail({
          from: process.env.SMTP_FROM || `${brand} <${process.env.SMTP_USER}>`,
          to: toInternal,
          subject: `🆕 Nouvelle demande — ${ticketId}`,
          html: adminEmailHtml({ brand, logo, ticket: ticketId, p }),
          replyTo: p.email || undefined,
        })
        if (debug) console.log('[email][admin][smtp]:', info)
      }
    } catch (e) {
      console.error('[email][admin] error:', e)
    }

    // Client → SMTP (Resend bloque sans domaine)
    if (p.email) {
      try {
        const t = smtpTransport()
        const info = await t.sendMail({
          from: process.env.SMTP_FROM || `${brand} <${process.env.SMTP_USER}>`,
          to: p.email,
          ...(bccClientToAdmin ? { bcc: toInternal } : {}),
          subject: `Accusé de réception — ${ticketId}`,
          html: clientEmailHtml({ brand, logo, ticket: ticketId, p }),
          replyTo: toInternal,
        })
        if (debug) console.log('[email][client][smtp]:', info)
      } catch (e) {
        console.error('[email][client] error:', e)
      }
    }

    return NextResponse.json({ ok: true, ticket: ticketId })
  } catch (err) {
    console.error('[api/contact] error:', err)
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}
