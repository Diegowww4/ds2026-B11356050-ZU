create extension if not exists pgcrypto;

create table if not exists consultation_records (
  id uuid primary key default gen_random_uuid(),
  name text,
  age int,
  pain_area text,
  pain_reason text,
  pain_level int,
  swelling boolean default false,
  bruise boolean default false,
  numbness boolean default false,
  weakness boolean default false,
  unable_to_walk boolean default false,
  wound boolean default false,
  suspected_fracture boolean default false,
  duration text,
  line_user_id text,
  line_display_name text,
  result_type text,
  can_use_tape boolean,
  suggestion text,
  tape_method text,
  warning text,
  recommended_department text,
  created_at timestamp with time zone default now()
);

create table if not exists tape_guides (
  id uuid primary key default gen_random_uuid(),
  body_part text not null,
  possible_condition text,
  tape_method text,
  warning text,
  recommended_department text,
  created_at timestamp with time zone default now()
);

create table if not exists line_messages (
  id uuid primary key default gen_random_uuid(),
  line_user_id text,
  user_message text,
  bot_reply text,
  created_at timestamp with time zone default now()
);

create table if not exists line_user_notice_logs (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  notice_date date not null,
  notice_type text not null,
  created_at timestamp with time zone default now(),
  unique(line_user_id, notice_date, notice_type)
);
