# Pantebanken

Oversikt over klassens pantepenger: saldo, når det sist ble pantet, og ukestatistikk.
Alle kan se oversikten. Bare admin kan registrere, endre og slette.

**Stack:** React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, TanStack Query, Supabase (Postgres + Auth).

## Kom i gang

```bash
npm install
cp .env.example .env   # fyll inn verdiene, se under
npm run dev
```

| Kommando | Hva den gjør |
|---|---|
| `npm run dev` | Utviklingsserver |
| `npm run build` | Typesjekk + produksjonsbygg til `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Forhåndsvis produksjonsbygget |

## Sette opp Supabase (én gang)

1. Opprett et gratis prosjekt på [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: lim inn hele [supabase/schema.sql](supabase/schema.sql) og trykk **Run**.
3. **Authentication → Sign In / Providers**: skru **av** «Allow new users to sign up».
4. **Authentication → Users → Add user**: opprett deg selv (e-post + passord, huk av «Auto confirm»).
5. Gjør deg selv til admin i **SQL Editor**:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'din@epost.no';
   ```
   Samme kommando brukes hvis en lærer skal kunne overta.
6. **Project Settings → API Keys**: kopier *Project URL* og *Publishable key* inn i `.env`.

### Tilgangsregler (Row Level Security)

| Hvem | Lese | Opprette / endre | Slette permanent |
|---|---|---|---|
| Alle (ikke innlogget) | ✅ aktive rader | ❌ | ❌ |
| Admin | ✅ også slettede | ✅ | ❌ (bruker `deleted_at`) |

Beløp lagres i **øre** (`amount_ore`, heltall), så summer aldri får avrundingsfeil.

### Merk: gratisprosjekter settes på pause

Supabase pauser gratisprosjekter etter rundt en uke uten aktivitet (f.eks. i ferier).
Gjenopprett prosjektet fra dashboardet. Dataene blir ikke borte.
