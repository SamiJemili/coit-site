import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"

export default async function AdminTickets(){
  const session = await getServerSession(authOptions)
  const user = session?.user
  const admins = (process.env.ADMIN_EMAILS||"").split(",").map(s=>s.trim().toLowerCase())
  if(!user || !admins.includes(String(user.email||"").toLowerCase())) {
    return <main className="section"><div className="container">Accès refusé.</div></main>
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, comments: true, payments: true }
  })

  return (
    <main className="section">
      <div className="container">
        <h1 className="text-2xl font-bold">Admin — Tickets</h1>
        <div className="mt-4 space-y-4">
          {tickets.map(t=>(
            <div key={t.id} className="card">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.ticketId} — {t.title} — {t.user?.email}</div>
                <form action={`/api/admin/tickets/status`} method="post">
                  <input type="hidden" name="id" value={t.id}/>
                  <select name="status" defaultValue={t.status} className="border rounded px-2 py-1">
                    <option>NEW</option><option>IN_PROGRESS</option><option>ON_HOLD</option><option>DONE</option><option>CLOSED</option>
                  </select>
                  <button className="ml-2 btn-secondary">Maj</button>
                </form>
              </div>
              <div className="text-sm text-slate-600 mt-1">Paiement: {t.payments.at(0)?.status || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
