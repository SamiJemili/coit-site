export default function Features(){
  const items = [
    { title: 'Support à distance', text: 'Résolution rapide via AnyDesk/Teams. Forfaits au ticket ou banque d’heures.' },
    { title: 'Infrastructure & Réseau', text: 'Pare-feu FortiGate, VLAN, Wi‑Fi pro, sauvegarde Veeam/NAS.' },
    { title: 'Projets & Cloud', text: 'Microsoft 365, Azure/Intune, virtualisation, NAS Synology/QNAP.' },
  ]
  return (
    <section className="section bg-slate-50">
      <div className="container grid md:grid-cols-3 gap-6">
        {items.map((f, i) => (
          <div key={i} className="card">
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-slate-600 mt-2">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
