# Intern logg: Pantebanken (pant-tracker), session 24.–25. november 2026

> Til eget bruk senere. Tre deler: **hva som ble bygget**, **hvordan problemene ble løst**, og **hvordan jeg brukte AI**, med innspill på prompting og tokens.

---

## 1. Kort oppsummering

**Mål:** En webapp der klassen (10 elever + 3 lærere) ser saldoen for pantepengene, når det sist ble pantet, total pant og ukestatistikk. Bare jeg registrerer.

**Status ved slutten av økta:**

| Steg | Innhold | Status |
|---|---|---|
| 0 | Plan og evaluering av rammeverk (plan-modus) | ✅ |
| 1 | Scaffold: Vite + React 19 + TS + Tailwind v4 + React Router | ✅ |
| 2 | Supabase: skjema, Row Level Security, klient, typer · bytte fra oxlint til ESLint | ✅ |
| 3 | Oversikt: saldo, sist pantet, totaler, kontoutskrift | ✅ |
| 4 | Innlogging og registrering av pant/utgift | ✅ |
| 5 | Historikk/Utgifter med månedsfilter, rediger, myk sletting og «Angre» | ✅ |
| 6 | Ukegraf (SVG) med tabell og tastaturstyring | ✅ |
| – | Redesign: leken grønn/gul stil, Bricolage + Figtree, lucide-ikoner, gjenbrukbare UI-komponenter | ✅ |
| – | Feilsøking av admin-tilgang + forbedringer | ✅ |
| – | Mobil: bunnmeny, kort i stedet for tabell, skalerende saldo | ✅ |
| 7 | Tilgjengelighetsgjennomgang, publisering, mindre JS-fil | ⏳ gjenstår |

**Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, React Router 8, TanStack Query 5, Supabase (Postgres + Auth), lucide-react, Vitest (74 tester).

---

## 2. Beslutninger og hvorfor

| Beslutning | Hvorfor |
|---|---|
| **React + Vite**, ikke Next.js | Ingen behov for SSR/SEO. Supabase er backenden, så en statisk app holder. Passer det jeg kan fra før. |
| **Supabase** som database | Varigere enn localStorage, gratis, innebygd innlogging og tilgangsregler, ingen egen server å drifte. |
| **Alle leser, bare admin skriver** | Åpenhet for klassen, men én ansvarlig for registreringen. Håndheves i databasen (RLS), ikke bare i appen. |
| **Admin styres av tabellen `admins`** | Ingen e-post i koden, og en lærer kan få tilgang med én SQL-linje. |
| **Beløp lagres i øre** (heltall) | Summer får aldri avrundingsfeil. 150 kr = 15000. |
| **Datoer som `YYYY-MM-DD`** uten klokkeslett | Sommertid og sene kvelder gir ikke feil dag. Testet rundt årsskifte og sommertid. |
| **Myk sletting** (`deleted_at`) | Felles penger: klassen skal kunne stole på at ingenting forsvinner i det stille. Gjør «Angre» mulig. |
| **Utgifter med fra start** | Uten utgifter finnes det ingen saldo. |
| **«Bra uke» = minst snittet av hele uker** | Inneværende uke teller ikke, så den ikke stemples som dårlig på en mandag. |
| **Grønn + gul (giftful-stil), Bricolage + Figtree** | Mitt valg blant forslag: lekent, men lesbart. |
| **Bunnmeny på mobil** | Registreringen skjer ved pantemaskinen, på telefonen. |

---

## 3. Problemløsning: hva gikk galt og hvordan det ble løst

### Miljø og verktøy
- **oxlint ble blokkert av Windows** («Application Control policy»). Smart App Control stopper programfilen.
  → Byttet til ESLint, som er ren JavaScript.
- **ESLint støtter ikke TypeScript 7** (`typescript-eslint` krever TS under 6.1).
  → Låste TypeScript til 6.0.3, slik Vites egen ESLint-mal gjør.
- **Headless Chrome kunne ikke ta skjermbilder i mobilbredde** (minste vindusbredde).
  → Styrte Chrome direkte via DevTools-protokollen med mobil-emulering (360/390/320 px, berøring).

### Supabase
- **Varselet «Potential issue detected» ved kjøring av `schema.sql`.** Det kommer av `drop policy if exists` og `revoke`. Ufarlig, for ingen tabeller eller data slettes.
  - Bak varselet så det ut til at linje 1 i editoren var filnavnet (`supabase/schema.sql`). Det ga en syntaksfeil.
- **Admin-tilgangen virket ikke.** Rotårsaken ble ikke bekreftet, men tre ting ble funnet og rettet:
  1. Appen husket svaret fra admin-sjekken for alltid. Logget jeg inn *før* jeg ble lagt i `admins`, viste den «ingen tilgang» til jeg logget ut. *(Feilen var AIs egen fra steg 4.)*
  2. Feilet admin-sjekken, sto appen fast på «Sjekker …».
  3. Ubekreftet e-post ga bare en generell feilmelding.
  - Fiks: ny sjekk når fanen får fokus, knappen «Sjekk tilgang på nytt», og bruker-ID vist på Konto. I tillegg tre SQL-spørringer for feilsøking (står i chatten og i README).

### Kvalitet som ble fanget opp ved å verifisere (ikke ved å stole på koden)
- **Kontrast:** Kantfargen var 2,95:1 (krav 3:1). Fokusringen var nesten usynlig på det grønne kortet i mørkt tema (1,25:1). Begge ble funnet ved å *regne ut* kontrasten.
- **Graf, funnet på skjermbilder:**
  - Snitt-etiketten lå oppå en stolpe.
  - Ukenumrene kolliderte på smal skjerm.
  - Snittet ble vist med øre («256,36 kr»).
- **Tastaturfeil:** Raske piltasttrykk flyttet bare én uke, fordi tastehåndtereren leste en gammel verdi av aktiv uke. Funnet ved å simulere tastetrykk i nettleseren.
- **Graffarger:** sjekket med et valideringsskript for fargeblindhet. Mørkt tema fikk egne fargetrinn.
- **Mobil:** målte at ingen side får horisontal rulling, og testet et stort beløp («12 520,50 kr») på 320 px.

**Lærdom:** AI-en gjorde flere feil underveis (admin-hurtigminnet, kontrast, grafetiketter, tastaturfeilen). De ble funnet fordi arbeidet ble *verifisert*: tester, utregnet kontrast, skjermbilder. Be alltid om verifisering, eller gjør den selv.

---

## 4. Hvordan jeg brukte AI: vurdering og innspill

### Det som fungerte bra 👍
1. **God startbrief.** Jeg beskrev problemet («husker ikke sist jeg pantet», «total i kroner», «bra/dårlig uke»), rammene (WCAG, varigere enn localStorage, én ansvarlig) og ba om en *evaluering* og *situasjoner jeg ikke har tenkt på*. Det ga en plan med reelle valg i stedet for bare kode.
2. **Plan før kode.** Plan-modus først, så ett steg om gangen med bekreftelse. Billig å tenke før det dyre arbeidet starter.
3. **Spurte før jeg godkjente** («Hva skal gjøres på steg 3?»). Jeg forsto hva som ble bygget før det skjedde.
4. **Stilte «er dette nødvendig?»-spørsmål** (CRUD). Det tvinger frem begrunnelser.
5. **Skjermbilder i stedet for lange beskrivelser.** Supabase-varselet og designreferansene ga mye informasjon raskt. Referansene var avgjørende for redesignet.
6. **Faste konvensjoner i en egen skill** (`frontend-dev-defaults`). Mappestruktur og stack trengte ikke gjentas.
7. **Korte oppfølginger** når konteksten var etablert («Gå videre til steg 5»). Effektivt.

### Forbedringspotensial 🎯
1. **Rapporter testresultater før du går videre.**
   - Etter steg 4 og 5 ba AI-en om tilbakemelding på testen. Svaret var «gå videre» uten resultat.
   - Admin-problemet dukket først opp senere, etter redesignet, da mer kode bygde på det.
   - *Neste gang:* «Testet steg 4: innlogging OK, lagring feiler med ‹melding›» før neste steg.
2. **Gi konkrete symptomer ved feil.**
   - «Fikk ikke helt admin-tilgang» tvang AI-en til å dekke alle mulige årsaker.
   - *Bedre:* skjermbilde av Konto-siden + den eksakte feilmeldingen + hva du har gjort i Supabase. Det sparer en runde og mange tokens.
3. **Ta med alle krav tidlig.**
   - Leken stil, lucide-ikoner, egen font og mobil kom *etter* at alt var bygget. Redesignet og mobiltilpasningen endret til sammen ~30 filer, noen av dem to ganger.
   - *Neste gang:* skriv «mobil først (registrering ved pantemaskinen)», stilønsker og ikonbibliotek i startbriefen.
4. **Slå sammen beslektede ønsker.** «Redesign + mobil» i én forespørsel hadde gitt én gjennomgang av filene i stedet for to.
5. **Si hva du *ikke* trenger.** Rapportene var lange. Du kan be om «kort oppsummering, maks 10 linjer» når detaljene ikke er viktige.
6. **Små ting:** Den siste meldingen var limt inn to ganger, som gir dobbelt tekst og tokens. Prosjektmappen heter «kvitteringsappen» mens appen heter Pantebanken, så velg ett navn tidlig.

### Tokens: hvordan bruke dem smartere 💰
- **Lange økter blir dyre.** Hele samtalen sendes på nytt for hver melding, så meldingene blir dyrere jo lenger økta varer.
  - Start en **ny økt per større fase** (for eksempel steg 7). Gi denne loggen og en `CLAUDE.md` som overlevering.
  - Bruk `/compact` når en økt blir lang.
- **Lag `CLAUDE.md`** (kommandoen `/init`) med prosjektkonvensjonene. Da slipper nye økter å lete seg frem.
- **Skjermbilder er verdt prisen** når de erstatter mange ord. Beskjær til det relevante utsnittet, og hele skjermen er sjelden nødvendig.
- **Verifisering koster, men lønner seg** for visuelt arbeid og logikk (grafer, kontrast, mobil). Den kan droppes for rene tekstendringer.
- **Kjør enkle sjekker selv:** `npm test`, `npm run lint` og `npm run dev`. Bruk AI-en der du trenger vurdering, ikke til å trykke på knapper.
- **Effort-nivå:** Rutinesteg som allerede er planlagt trenger ikke høy effort. Spar høy effort til åpne problemer, som feilsøking og arkitektur.

### Promptmaler til neste gang

**Nytt steg:**
```
Steg <n>: <mål i én setning>.
Ferdig når: <hvordan jeg ser at det virker>.
Utenfor scope: <hva som ikke skal gjøres nå>.
Testet forrige steg: <OK / feil + melding>.
```

**Feilrapport:**
```
Forventet: <hva skulle skjedd>
Faktisk: <hva skjedde> + skjermbilde
Feilmelding: <eksakt tekst>
Allerede prøvd: <tiltak>
Miljø: <side/URL, innlogget som, mobil/PC>
```

**Designendring:**
```
Referanse: <bilde>. Behold: <det som skal bli som før>.
Endre: <konkret, f.eks. «saldokortet gult, runde knapper»>.
Må fortsatt: WCAG AA, fungere på mobil.
```

---

## 5. Åpne punkter og neste steg

1. ⚠️ **Prosjektet er ikke under versjonskontroll** (`git init` er ikke kjørt). Kjør `git init` og commit før steg 7, så endringer kan rulles tilbake.
2. **Steg 7:** tilgjengelighetsgjennomgang (`design:accessibility-review`), publisering på Vercel/Netlify med miljøvariabler, og en mindre JS-fil (630 kB, 184 kB komprimert).
3. **Admin-tilgang:** Bekreft at innlogging og lagring virker. Det er fortsatt ikke testet mot den ekte databasen.
4. **Spørsmål å avklare med klassen:**
   - Hvor ligger pengene fysisk (kontanter, Vipps, konto)? Trengs et felt for «innløst / ikke innløst»?
   - Hvilken lærer skal være reserve-admin?
   - Er «bra uke» riktig målestokk, eller er måned bedre når dere panter sjelden?
5. **Supabase gratisprosjekt pauses** etter rundt en uke uten aktivitet, for eksempel i juleferien. Det kan gjenopprettes fra dashboardet.
6. **Fase 2-ideer:** sparemål/ønskeliste med fremdriftslinje, CSV-eksport som backup, bilde av pantelappen, PWA («legg til på hjemskjerm»).

---

## 6. Nyttige kommandoer og filer

| Kommando | Hva |
|---|---|
| `npm run dev` | Utviklingsserver |
| `npm run dev -- --host` | Test på mobil på samme Wi-Fi |
| `npm test` | 74 enhetstester (formatering, beregninger, validering, uker) |
| `npm run lint` / `npm run build` | ESLint / typesjekk + bygg |

| Fil/mappe | Innhold |
|---|---|
| `supabase/schema.sql` | Tabeller, RLS-regler, `is_admin()`. Kan kjøres på nytt. |
| `README.md` | Oppsett av Supabase steg for steg, med SQL for admin |
| `src/index.css` | Farger (målt kontrast), fonter, størrelser |
| `src/components/ui/` | Gjenbrukbare komponenter (Button, Card, IconBadge, StatusPill …) |
| `src/lib/` | Rene funksjoner med tester: `format`, `stats`, `weekly`, `validation` |
| `src/lib/content/` | All norsk tekst |
