// app/ticket/page.js
'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TicketClientPage(){
  const [ticketId, setTicketId] = useState('')
  const [email, setEmail] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [msg, setMsg] = useState('')

  async function loadTicket(e){
    e?.preventDefault()
    setLoading(true); setMsg('')
    const res = await fetch('/api/tickets/view', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ticketId, email })
    })
    const json = await res.json()
    if(json.ok) setData(json.ticket)
    else { setData(null); setMsg("Ticket introuvable. Vérifiez l'ID et l'email.") }
    setLoading(false)
  }

  async function addComment(e){
    e.preventDefault()
    setLoading(true); setMsg('')
    const res = await fetch('/api/tickets/comment', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ticketId, email, body: comment })
    })
    const json = await res.json()
    if(json.ok){ setComment(''); await loadTicket() ; setMsg('Commentaire ajouté.') }
    else setMsg("Échec de l'ajout du commentaire.")
    setLoading(false)
  }

  return (
    <>
  
      <main className="section">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Suivre mon ticket</h1>
          <p className="text-slate-600 mt-2">Entrez votre numéro de ticket et votre email.</p>

          <form onSubmit={loadTicket} className="card mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Numéro de ticket</label>
              <input value={ticketId} onChange={e=>setTicketId(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <button className="btn-primary" disabled={loading}>{loading?'Chargement...':'Voir le ticket'}</button>
            {msg && <p className="text-sm text-slate-700">{msg}</p>}
          </form>

          {data && (
            <div className="card mt-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Ticket {data.ticketId}</h2>
                <span className="text-xs px-2 py-1 rounded bg-slate-100">{data.status}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p><b>Nom:</b> {data.name}</p>
                <p><b>Email:</b> {data.email}</p>
                <p><b>Type:</b> {data.mode || '-'}</p>
                <p><b>Créé le:</b> {new Date(data.createdAt).toLocaleString()}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Historique</h3>
                <div className="space-y-3">
                  {data.comments.map(c=>(
                    <div key={c.id} className="rounded border border-slate-200 p-3">
                      <div className="text-xs text-slate-500">{c.author} — {new Date(c.createdAt).toLocaleString()}</div>
                      <div className="mt-1 whitespace-pre-wrap">{c.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={addComment} className="mt-6 space-y-2">
                <label className="block text-sm font-medium">Ajouter un commentaire</label>
                <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <button className="btn-secondary" disabled={loading || !comment.trim()}>Envoyer</button>
              </form>
            </div>
          )}
        </div>
      </main>
     
    </>
  )
}
