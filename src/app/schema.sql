create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  phone text not null unique,
  qr_token text not null unique,
  punches int not null default 0 check (punches >= 0 and punches <= 9),
  reward_ready boolean not null default false,
  redemptions int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.punch_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  event_type text not null check (event_type in ('punch_added', 'reward_redeemed')),
  staff_note text,
  created_at timestamptz not null default now()
);
