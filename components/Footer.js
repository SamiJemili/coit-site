export default function Footer(){
  return (
    <footer className="border-t border-slate-200 mt-20">
      <div className="container py-10 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} CoIT Consulting. Tous droits réservés.</p>
        <div className="flex gap-4">
          <a href="/contact" className="hover:text-slate-900">Contact</a>
          <a href="#" className="hover:text-slate-900">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  )
}
