import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"
import { generateTicketId } from "@/lib/tickets"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Resend } from "resend"

export const dynamic = "force-dynamic" // pour forcer l’actualisation en dev

export default async function Dashboard({ searchParams }) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    return <main className="section"><div className="container">Veuillez vous connecter.</div></main>
  }

  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { payments: true, comments: true },
  })

  async function createTicket(formData) {
    "use server"
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) return

    const title = String(formData.get("title") || "").trim() || "Ticket sans titre"
    const message = String(formData.get("message") || "").trim()
    const mode = String(formData.get("mode") || "") || null
    const ticketId = generateTicketId("COT")

    // 1) DB
    await prisma.ticket.create({
      data: {
        ticketId,
        title,
        message,
        mode,
        userId: user.id,
        comments: { create: [{ body: message, authorId: user.id }] },
      },
    })

    // 2) (Optionnel) email admin via Resend
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const brand = process.env.BRAND_NAME || "CoIT 360"
      const from = process.env.RESEND_FROM || "onboarding@resend.dev"
      await resend.emails.send({
        from: `${brand} <${from}>`,
        to: [process.env.CONTACT_TO],
        subject: `🆕 Nouveau ticket client — ${ticketId}`,
        html: `
          <div style="font-family:Arial;padding:16px">
            <h3 style="margin:0 0 8px 0">Nouveau ticket</h3>
            <p><b>Ticket:</b> ${ticketId}</p>
            <p><b>Client:</b> ${user.email}</p>
            <p><b>Sujet:</b> ${title}</p>
            <p><b>Message:</b><br/>${message.replace(/\n/g,"<br/>")}</p>
          </div>
        `,
      })
    }

    // 3) refresh + feedback visible
    revalidatePath("/dashboard")
    redirect(`/dashboard?created=1&tid=${ticketId}`)
  }

  const created = searchParams?.created === "1"
  const tid = searchParams?.tid

  return (
    <main className="section">
      <div className="container grid md:grid-cols-2 gap-8">

        <section className="card">
          <h2 className="font-semibold mb-2">Nouveau ticket</h2>
          {created && tid && (
            <div className="mb-3 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm">
              Ticket créé : <b>{tid}</b>
            </div>
          )}
          <form action={createTicket} className="space-y-3">
            <input name="title" required placeholder="Sujet" className="w-full border rounded px-3 py-2"/>
            <select name="mode" className="w-full border rounded px-3 py-2">
              <option value="remote">À distance</option>
              <option value="onsite">Sur site</option>
            </select>
            <textarea name="message" rows={5} required className="w-full border rounded px-3 py-2" placeholder="Décrivez votre besoin"/>
            <button className="btn-primary">Créer</button>
          </form>
        </section>

        <section className="card">
          <h2 className="font-semibold mb-2">Mes tickets</h2>
          <div className="space-y-3">
            {tickets.map(t=>(
              <div key={t.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.title}</div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{t.status}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {t.ticketId} — {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {!tickets.length && <p>Aucun ticket pour l’instant.</p>}
          </div>
        </section>

      </div>
    </main>
  )
}
