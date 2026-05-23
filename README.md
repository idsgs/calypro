# Cal.pro — MVP de réservation en ligne

Alternative française à Calendly. **Stack $0**.

## Stack technique

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Supabase (gratuit) |
| Auth | NextAuth.js v4 (Google + Email magic link) |
| Paiements | Stripe |
| Emails | Resend |
| Hosting | Railway ou Vercel |

## Démarrage rapide

### 1. Base de données (Supabase)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier la `DATABASE_URL` depuis Settings > Database

### 2. Google OAuth

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet → Credentials → OAuth 2.0 Client ID
3. Ajouter `http://localhost:3000/api/auth/callback/google` en URI autorisé

### 3. Resend (emails)

1. Créer un compte sur [resend.com](https://resend.com)
2. Générer une API key

### 4. Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Copier les clés test depuis le Dashboard
3. Créer un webhook pointant vers `/api/webhooks/stripe`

### 5. Installation

```bash
cp .env.local.example .env.local
# Remplir les valeurs dans .env.local

npm install
npx prisma generate
npx prisma db push
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
app/
  page.tsx                    # Landing page
  layout.tsx                  # Layout racine
  dashboard/
    page.tsx                  # Dashboard principal
    settings/page.tsx         # Paramètres profil
  [username]/[slug]/page.tsx  # Page de réservation publique
  cancel/[token]/page.tsx     # Annulation de réservation
  auth/signin/page.tsx        # Page de connexion
  api/
    auth/[...nextauth]/       # NextAuth
    event-types/              # CRUD types d'événements
    bookings/                 # CRUD réservations
    public/[username]/[slug]/ # API publique (infos + créneaux)
    cancel/[token]/           # Annulation
    user/                     # Profil utilisateur
    webhooks/stripe/          # Webhooks Stripe

components/
  Navigation.tsx
  Providers.tsx
  dashboard/
    Sidebar.tsx
    BookingsCalendar.tsx
    UpcomingBookings.tsx
    StatsBar.tsx
    CreateEventTypeModal.tsx
  booking/
    BookingCalendar.tsx
    BookingForm.tsx
    BookingSuccess.tsx

lib/
  prisma.ts    # Client Prisma singleton
  auth.ts      # Config NextAuth
  slots.ts     # Calcul des créneaux disponibles
  email.ts     # Envoi d'emails via Resend
  stripe.ts    # Client Stripe
  ical.ts      # Génération iCal

prisma/
  schema.prisma
```

## Déploiement (Railway)

1. Push le code sur GitHub
2. Créer un projet sur [railway.app](https://railway.app)
3. Connecter le repo GitHub
4. Ajouter un plugin PostgreSQL
5. Configurer les variables d'environnement
6. Déployer

## Roadmap V2

- [ ] SMS reminders (Twilio)
- [ ] Champs custom (UI complète)
- [ ] Équipes multi-membres
- [ ] Analytics de réservation
- [ ] Templates email personnalisés
- [ ] Branding (couleurs, logo)
- [ ] Webhooks / API publique
- [ ] Sync Microsoft Calendar
