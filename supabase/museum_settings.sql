-- RF-14: Taquilla Digital y QR Dinámico de Pago
-- Tabla de configuración de taquilla: una sola fila (id = 1).
-- Lectura pública (precio, enlace de pago y datos SPEI) y escritura solo
-- para administradores autenticados, igual que `rooms` (RF-10).

create table if not exists public.museum_settings (
  id integer primary key default 1 check (id = 1),
  ticket_price numeric(10, 2) not null default 0,
  currency text not null default 'MXN',
  payment_link text,
  bank_clabe text,
  bank_beneficiary text,
  updated_at timestamptz not null default now()
);

-- Fila por defecto: precio 0 hasta que el administrador lo configure.
insert into public.museum_settings (id)
values (1)
on conflict (id) do nothing;

-- updated_at se actualiza solo (si el trigger ya existe, se recrea).
create or replace function public.touch_museum_settings()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists museum_settings_touch on public.museum_settings;
create trigger museum_settings_touch
  before update on public.museum_settings
  for each row execute function public.touch_museum_settings();

-- RLS
alter table public.museum_settings enable row level security;

drop policy if exists "Lectura publica museum_settings" on public.museum_settings;
create policy "Lectura publica museum_settings"
  on public.museum_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Escritura administradores museum_settings" on public.museum_settings;
create policy "Escritura administradores museum_settings"
  on public.museum_settings
  for update
  to authenticated
  using (true)
  with check (true);
