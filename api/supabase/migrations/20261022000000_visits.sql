-- One row per /api/visits call, so the demo shows each environment's traffic.
create table if not exists visits (
  id bigint generated always as identity primary key,
  env text not null,
  version text not null,
  created_at timestamptz not null default now()
);
