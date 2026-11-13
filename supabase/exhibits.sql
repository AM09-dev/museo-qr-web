-- RF-13: piezas individuales por sala (obras y objetos).
-- Ejecutar en el SQL Editor de Supabase. Requiere la tabla `rooms` (RF-08).

create table if not exists public.exhibits (
  id          uuid primary key default gen_random_uuid(),
  room_id     text not null references public.rooms (id) on delete cascade,
  position    integer not null default 0,
  name        jsonb not null default '{"es": "", "en": "", "fr": "", "de": ""}'::jsonb,
  description jsonb not null default '{"es": "", "en": "", "fr": "", "de": ""}'::jsonb,
  image_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists exhibits_room_position_idx
  on public.exhibits (room_id, position);

-- RLS: lectura pública; escritura solo para administradores autenticados (RF-10).
alter table public.exhibits enable row level security;

drop policy if exists "exhibits_select_public" on public.exhibits;
create policy "exhibits_select_public"
  on public.exhibits for select
  to anon, authenticated
  using (true);

drop policy if exists "exhibits_insert_authenticated" on public.exhibits;
create policy "exhibits_insert_authenticated"
  on public.exhibits for insert
  to authenticated
  with check (true);

drop policy if exists "exhibits_update_authenticated" on public.exhibits;
create policy "exhibits_update_authenticated"
  on public.exhibits for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "exhibits_delete_authenticated" on public.exhibits;
create policy "exhibits_delete_authenticated"
  on public.exhibits for delete
  to authenticated
  using (true);
