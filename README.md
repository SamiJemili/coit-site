# CoIT Consulting — Starter Next.js + Tailwind (App Router)

Un squelette propre, rapide et SEO‑friendly pour un site de consulting TI.

## Prérequis sur votre PC
- **Node.js LTS** (v20.x recommandé) → https://nodejs.org/
- **Git** → https://git-scm.com/
- **VS Code** (ou votre IDE) → https://code.visualstudio.com/

## Démarrer le projet
```bash
# 1) Créer un nouveau projet Next.js
npx create-next-app@latest coit-site --use-npm --eslint --no-src-dir --app --tailwind --ts=false

# 2) Remplacer les fichiers par ceux de ce starter
#   Copiez le contenu de ce dossier dans votre nouveau dossier coit-site (écrasez les fichiers).
#   OU dézippez ce starter directement dans votre répertoire de projet.

# 3) Installer les dépendances (si nécessaire)
npm install

# 4) Lancer en local
npm run dev    # puis ouvrez http://localhost:3000
```

## Déploiement rapide
- **Vercel** (recommandé): https://vercel.com/ — importez votre repo GitHub, déploiement auto.
- **GitHub Pages** (site statique) ou **hébergeur mutualisé** (OVH/Hostinger/Infomaniak).

## Brancher le formulaire de contact
- **Formspree**: créez un formulaire, récupérez l’URL et remplacez `https://formspree.io/f/yourFormId` dans `app/(site)/contact/page.js`.
- **EmailJS**: alternative sans backend.

## Personnalisation rapide
- Couleurs: `tailwind.config.js` (`colors.brand`).
- Logo & favicon: placez vos fichiers dans `public/` et mettez à jour le layout.
- Titres/meta: `app/layout.js` et `export const metadata` dans chaque page.
