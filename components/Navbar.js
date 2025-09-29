'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin = !!(user?.email && admins.includes(user.email.toLowerCase()));

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-lg tracking-tight">CoIT <span className="text-slate-500">360</span></Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/services">Services</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact" className="btn-primary px-3 py-1 rounded">Demander un devis</Link>
          <Link href="/ticket" className="text-slate-600">Suivre un ticket</Link>
          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="text-slate-900">Mon espace</Link>
              {isAdmin && <Link href="/admin/tickets" className="text-amber-700 font-semibold">Admin</Link>}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-slate-600 px-3 py-1 rounded hover:bg-slate-100"
                aria-label="Se déconnecter"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('email', { callbackUrl: '/dashboard' })}
              className="text-slate-900 px-3 py-1 rounded hover:bg-slate-100"
              aria-label="Se connecter"
            >
              Se connecter
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}