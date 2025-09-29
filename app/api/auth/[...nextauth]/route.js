import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"   // <= v4
import { prisma } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        const html = `
          <div style="font-family:Arial;padding:20px">
            <h2>Connexion à CoIT 360</h2>
            <p>Cliquez pour vous connecter :</p>
            <p><a href="${url}" style="display:inline-block;padding:10px 14px;background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none">Se connecter</a></p>
            <p style="font-size:12px;color:#64748b">Ce lien expire dans 10 minutes.</p>
          </div>`
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: [identifier],
          subject: "Votre lien de connexion",
          html
        })
      }
    })
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    }
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
