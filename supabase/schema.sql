-- =====================================================================
-- Pantebanken – databaseskjema for Supabase
--
-- Kjør hele filen i Supabase-dashboardet: SQL Editor → New query → Run.
-- Filen kan kjøres på nytt uten å miste data (idempotent).
--
-- Tilgangsmodell:
--   * Alle (også uten innlogging) kan LESE registreringer som ikke er slettet.
--   * Bare brukere i tabellen `admins` kan opprette og endre.
--   * Ingen kan slette rader permanent via appen. Sletting = sette `deleted_at`.
--
-- Beløp lagres i ØRE som heltall (amount_ore), så summer aldri får
-- avrundingsfeil. 150 kr = 15000.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Admins: hvem som har skrivetilgang
-- Legg til en admin (etter at brukeren er opprettet under Authentication):
--   insert into public.admins (user_id)
--   select id from auth.users where email = '<e-post>';
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- En innlogget bruker kan se om den selv er admin. Ingen kan endre tabellen
-- via appen; det gjøres bare i SQL Editor.
drop policy if exists "admins: les egen rad" on public.admins;
create policy "admins: les egen rad"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.admins from anon;
revoke insert, update, delete, truncate on public.admins from authenticated;
grant select on public.admins to authenticated;


-- Hjelpefunksjon brukt i reglene under. SECURITY DEFINER slik at den kan lese
-- admins-tabellen uten å trigge RLS-rekursjon.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- Holder updated_at oppdatert ved hver endring
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- Pant: én rad per pantelapp
-- ---------------------------------------------------------------------
create table if not exists public.pant_entries (
  id          uuid primary key default gen_random_uuid(),
  amount_ore  integer not null check (amount_ore > 0 and amount_ore <= 10000000),
  pant_date   date not null default current_date,
  note        text check (char_length(note) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists pant_entries_date_idx
  on public.pant_entries (pant_date desc)
  where deleted_at is null;

drop trigger if exists pant_entries_set_updated_at on public.pant_entries;
create trigger pant_entries_set_updated_at
  before update on public.pant_entries
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- Utgifter: hva pengene er brukt på
-- ---------------------------------------------------------------------
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  amount_ore  integer not null check (amount_ore > 0 and amount_ore <= 10000000),
  spent_date  date not null default current_date,
  description text not null check (char_length(description) between 1 and 200),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists expenses_date_idx
  on public.expenses (spent_date desc)
  where deleted_at is null;

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- Row Level Security for pant_entries og expenses
-- (samme regler for begge tabellene)
-- ---------------------------------------------------------------------
alter table public.pant_entries enable row level security;
alter table public.expenses     enable row level security;

-- LES: alle ser aktive rader; admin ser også slettede (for gjenoppretting)
drop policy if exists "pant: les" on public.pant_entries;
create policy "pant: les"
  on public.pant_entries for select
  to anon, authenticated
  using (deleted_at is null or (select public.is_admin()));

drop policy if exists "utgifter: les" on public.expenses;
create policy "utgifter: les"
  on public.expenses for select
  to anon, authenticated
  using (deleted_at is null or (select public.is_admin()));

-- OPPRETT: bare admin
drop policy if exists "pant: opprett" on public.pant_entries;
create policy "pant: opprett"
  on public.pant_entries for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "utgifter: opprett" on public.expenses;
create policy "utgifter: opprett"
  on public.expenses for insert
  to authenticated
  with check ((select public.is_admin()));

-- ENDRE (inkl. myk sletting via deleted_at): bare admin
drop policy if exists "pant: endre" on public.pant_entries;
create policy "pant: endre"
  on public.pant_entries for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "utgifter: endre" on public.expenses;
create policy "utgifter: endre"
  on public.expenses for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- SLETT: ingen policy = permanent sletting er blokkert for alle via API-et.

-- Eksplisitte rettigheter (RLS-reglene over avgjør hvilke rader)
revoke all on public.pant_entries, public.expenses from anon, authenticated;
grant select on public.pant_entries, public.expenses to anon, authenticated;
grant insert, update on public.pant_entries, public.expenses to authenticated;
