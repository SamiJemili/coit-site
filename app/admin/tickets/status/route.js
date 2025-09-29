import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// ...
export async function POST(req){
  const session = await getServerSession(authOptions)
  const user = session?.user
  const admins = (process.env.ADMIN_EMAILS||"").split(",").map(s=>s.trim().toLowerCase())
  if(!user || !admins.includes(String(user.email||"").toLowerCase())) return NextResponse.json({ok:false},{status:403})

  const form = await req.formData()
  const id = Number(form.get("id"))
  const status = String(form.get("status"))
  await prisma.ticket.update({ where: { id }, data: { status } })
  return NextResponse.redirect(new URL("/admin/tickets", req.url))
}
