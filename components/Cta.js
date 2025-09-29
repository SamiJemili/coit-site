import Link from 'next/link';

export default function Cta() {
  return (
    <section className="section">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Prêt à sécuriser et accélérer votre TI ?
        </h2>
        <p className="mt-3 text-slate-600">
          Parlez-moi de vos besoins et recevez un devis clair en 24h.
        </p>
        <div className="mt-6">
          <Link href="/contact" className="btn-primary">Commencer</Link>
        </div>
      </div>
    </section>
  );
}