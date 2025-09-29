// app/(site)/contact/page.js
'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Page(){
  const [status, setStatus] = useState('idle')
  const [ticket, setTicket] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setStatus('loading'); setTicket('')
    const form = e.currentTarget
    try{
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      const json = await res.json()
      if(res.ok && json.ok){
        setTicket(json.ticket)
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    }catch{
      setStatus('error')
    }
  }

  return (
    <>

      <main className="section">
        <div className="container grid md:grid-cols-2 gap-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demander un devis</h1>
            <p className="text-slate-600 mt-2">Expliquez votre besoin. Je vous réponds sous 24 h.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4 card">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Téléphone (optionnel)</label>
                <input name="phone" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Type d’intervention</label>
                <select name="mode" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="remote">À distance</option>
                  <option value="onsite">Sur site</option>
                  <option value="both">À discuter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea name="message" rows={5} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <button disabled={status==='loading'} className="btn-primary">
                {status==='loading' ? 'Envoi...' : 'Envoyer'}
              </button>
              {status==='success' && (
                <p className="text-green-600 text-sm">
                  Merci ! Demande envoyée. Votre ticket&nbsp;: <b>{ticket}</b>.
                </p>
              )}
              {status==='error' && <p className="text-red-600 text-sm">Une erreur est survenue. Réessayez.</p>}
            </form>
          </div>
          <div>
            <div className="card">
              <h3 className="font-semibold">Coordonnées</h3>
              <p className="text-slate-600 mt-2">Montréal / Rive-Nord — Interventions Québec</p>
              <div className="mt-4 space-y-2 text-slate-700">
                <p>Email: contact@coit360.local</p>
                <p>WhatsApp: +1 (514) 000-0000</p>
                <p>Disponibilités: Lun–Ven, 9h–17h</p>
              </div>
            </div>
            <div className="card mt-6">
              <h3 className="font-semibold">Planifier un appel</h3>
              <p className="text-slate-600 mt-2">Intégrez ici votre lien Calendly.</p>
              <iframe
                src="https://calendly.com/"
                style={{ minWidth: '320px', height: '630px' }}
                className="w-full rounded-xl border border-slate-200"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}
