'use client'
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(e){
    e.preventDefault()
    await signIn("email", { email, redirect: false })
    setSent(true)
  }

  return (
    <main className="section">
      <div className="container max-w-md card">
        <h1 className="text-2xl font-bold">Connexion</h1>
        {!sent ? (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="email@exemple.com" />
            <button className="btn-primary">Recevoir le lien</button>
          </form>
        ) : (
          <p>Vérifie ta boîte mail. Clique sur le lien pour te connecter.</p>
        )}
      </div>
    </main>
  )
}
