import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Services — CoIT Consulting' }

const services = [
  {
    title: 'Support & Helpdesk',
    bullets: [
      'Assistance à distance (AnyDesk/Teams)',
      'Packs au ticket ou banque d’heures',
      'Maintenance proactive et monitoring'
    ]
  },
  {
    title: 'Infrastructure & Réseau',
    bullets: [
      'Pare-feu FortiGate, VLAN, Wi‑Fi pro',
      'Sauvegarde Veeam, NAS Synology/QNAP',
      'Virtualisation (Hyper‑V/VMware)'
    ]
  },
  {
    title: 'Cloud & Microsoft 365',
    bullets: [
      'Migration boîtes mail & fichiers',
      'Sécurité, MFA, Intune/MDM',
      'Automatisations et bonnes pratiques'
    ]
  }
]

export default function Page(){
  return (
    <>
   
      <main className="section">
        <div className="container">
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {services.map((s, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold">{s.title}</h3>
                <ul className="mt-3 space-y-2 text-slate-600 list-disc list-inside">
                  {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

    </>
  )
}
