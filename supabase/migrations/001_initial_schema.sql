-- =====================================================================
-- Wellnur — Initial Schema
-- =====================================================================
-- Bu migration uygulamanın bağımlı olduğu tabloları oluşturur.
-- Eğer Supabase Dashboard üzerinden zaten kurulmuşsa CREATE IF NOT EXISTS
-- güvenli geçişi sağlar.
-- =====================================================================

-- UUID extension (Supabase'de varsayılan olarak açık olabilir)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id           text primary key,
  slug         text unique not null,
  name_tr      text not null,
  name_en      text not null,
  description_tr text,
  description_en text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id            text primary key,
  slug          text unique not null,
  category_id   text references public.categories(id) on delete set null,
  name_tr       text not null,
  name_en       text not null,
  desc_tr       text,
  desc_en       text,
  price         numeric(10, 2) not null check (price >= 0),
  trendyol_url  text,
  images        jsonb not null default '[]'::jsonb,
  colors        jsonb not null default '[]'::jsonb,
  sizes         jsonb not null default '[]'::jsonb,
  stock         integer not null default 0 check (stock >= 0),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- ---------------------------------------------------------------------
-- surgeon_profiles
-- ---------------------------------------------------------------------
create table if not exists public.surgeon_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  hospital_name text,
  specialty     text,
  phone         text,
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  full_name       text not null,
  email           text not null,
  phone           text not null,
  city            text not null,
  address         text not null,
  payment_method  text not null check (payment_method in ('bank_transfer', 'virtual_pos')),
  total_amount    numeric(12, 2) not null check (total_amount >= 0),
  status          text not null default 'pending'
                  check (status in ('pending', 'pending_payment', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ---------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------
create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      text references public.products(id) on delete set null,
  product_name    text not null,
  quantity        integer not null check (quantity > 0),
  price           numeric(10, 2) not null check (price >= 0),
  selected_size   text,
  selected_color  text,
  created_at      timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------------------------------------------------------------------
-- wholesale_applications
-- ---------------------------------------------------------------------
create table if not exists public.wholesale_applications (
  id             uuid primary key default gen_random_uuid(),
  company_name   text not null,
  contact_name   text not null,
  email          text not null,
  phone          text not null,
  message        text,
  status         text not null default 'new'
                 check (status in ('new', 'reviewed', 'approved', 'rejected')),
  created_at     timestamptz not null default now()
);
