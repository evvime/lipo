-- =====================================================================
-- Wellnur — Row Level Security (RLS) Policies
-- =====================================================================
-- Bu migration uygulama güvenliği için kritiktir. Tüm tablolar üzerinde
-- RLS aktif edilir ve rol bazlı erişim politikaları tanımlanır.
--
-- Admin tespiti: auth.jwt() -> 'app_metadata' içindeki 'role' değeri
-- 'admin' ise admin işlemleri yetkilidir. app_metadata yalnızca
-- service_role anahtarı ile güncellenebildiği için güvenlidir.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helper: is_admin()
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- =====================================================================
-- categories
-- =====================================================================
alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- products
-- =====================================================================
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- surgeon_profiles
-- =====================================================================
alter table public.surgeon_profiles enable row level security;

-- Cerrah sadece kendi profilini görür; admin tümünü görür
drop policy if exists "surgeon_profiles_owner_or_admin_read" on public.surgeon_profiles;
create policy "surgeon_profiles_owner_or_admin_read"
  on public.surgeon_profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

-- Yeni profil oluşturma: sadece kendi auth.uid() değeriyle (signup akışı)
drop policy if exists "surgeon_profiles_self_insert" on public.surgeon_profiles;
create policy "surgeon_profiles_self_insert"
  on public.surgeon_profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Güncelleme: kendi profilini güncelleyebilir AMA status alanını DEĞİŞTİREMEZ.
-- Status'u sadece admin değiştirebilir. (Trigger ile koruma — aşağıda.)
drop policy if exists "surgeon_profiles_self_update" on public.surgeon_profiles;
create policy "surgeon_profiles_self_update"
  on public.surgeon_profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Status alanını sadece admin değiştirebilir
create or replace function public.protect_surgeon_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and not public.is_admin() then
    raise exception 'Only admins can change surgeon_profiles.status';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists surgeon_profiles_protect_status on public.surgeon_profiles;
create trigger surgeon_profiles_protect_status
  before update on public.surgeon_profiles
  for each row execute function public.protect_surgeon_status();

drop policy if exists "surgeon_profiles_admin_delete" on public.surgeon_profiles;
create policy "surgeon_profiles_admin_delete"
  on public.surgeon_profiles for delete
  to authenticated
  using (public.is_admin());

-- =====================================================================
-- orders
-- =====================================================================
alter table public.orders enable row level security;

-- Misafir (anon) sipariş oluşturabilir
drop policy if exists "orders_anon_insert" on public.orders;
create policy "orders_anon_insert"
  on public.orders for insert
  to anon
  with check (user_id is null);

-- Login olmuş kullanıcı kendi user_id'siyle veya misafir olarak sipariş verebilir
drop policy if exists "orders_authenticated_insert" on public.orders;
create policy "orders_authenticated_insert"
  on public.orders for insert
  to authenticated
  with check (user_id is null or user_id = auth.uid());

-- Sipariş okuma: kullanıcı sadece kendi siparişlerini, admin tümünü görür
drop policy if exists "orders_owner_or_admin_read" on public.orders;
create policy "orders_owner_or_admin_read"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Sipariş güncelleme: sadece admin
drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- order_items
-- =====================================================================
alter table public.order_items enable row level security;

-- order_items insert: ilgili siparişin sahibi veya anon (henüz user_id yok)
-- Pratikte order ile birlikte yazılır; biz parent order'ı kontrol ederiz.
drop policy if exists "order_items_insert_with_order" on public.order_items;
create policy "order_items_insert_with_order"
  on public.order_items for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id is null
          or o.user_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "order_items_owner_or_admin_read" on public.order_items;
create policy "order_items_owner_or_admin_read"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- =====================================================================
-- wholesale_applications
-- =====================================================================
alter table public.wholesale_applications enable row level security;

drop policy if exists "wholesale_anon_insert" on public.wholesale_applications;
create policy "wholesale_anon_insert"
  on public.wholesale_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "wholesale_admin_read" on public.wholesale_applications;
create policy "wholesale_admin_read"
  on public.wholesale_applications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "wholesale_admin_update" on public.wholesale_applications;
create policy "wholesale_admin_update"
  on public.wholesale_applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- Storage: products bucket
-- =====================================================================
-- Bucket'ı manuel olarak Supabase Dashboard'dan "products" adıyla
-- public olarak oluşturduktan sonra aşağıdaki politikalar uygulanır.
-- =====================================================================

-- Yükleme yetkisi yalnızca admin
drop policy if exists "products_storage_admin_write" on storage.objects;
create policy "products_storage_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

-- Public okuma (CDN için)
drop policy if exists "products_storage_public_read" on storage.objects;
create policy "products_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'products');
