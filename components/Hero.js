import Link from 'next/link'

export default function Hero(){
  return (
    <section className="section">
      <div className="container grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support & Infrastructure <span className="text-brand-600">TI</span> pour PME
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Dépannage rapide, projets cloud/réseau, sécurité. Interventions à distance ou sur site. Sans engagement.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="btn-primary">Demander un devis</Link>
            <Link href="/services" className="btn-secondary">Voir les services</Link>
          </div>
          <ul className="mt-8 grid gap-2 text-slate-600">
            <li>• Mise en place Microsoft 365, sauvegarde, NAS</li>
            <li>• Pare-feu, VLAN, Wi‑Fi pro, VPN</li>
            <li>• Optimisation SQL/serveurs, migration cloud</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold">Prise de rendez-vous</h3>
          <p className="text-slate-600 mt-2">Planifiez un appel découverte (15 min) pour évaluer vos besoins.</p>
          <div className="mt-4">
            <a className="btn-primary" href="#calendly">Réserver</a>
          </div>
          <div id="calendly" className="mt-6">
            <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-500">
              Placez ici l'embed Calendly (optionnel).
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
