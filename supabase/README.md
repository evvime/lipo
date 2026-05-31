# Wellnur — Supabase Kurulum

## Migration sırası

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

Veya manuel olarak Supabase Dashboard > SQL Editor üzerinden sırasıyla çalıştırın:

1. `migrations/001_initial_schema.sql` — Tablolar
2. `migrations/002_rls_policies.sql` — RLS politikaları (KRİTİK)
3. `migrations/003_seed_admin.sql` — Admin atama rehberi (manuel)

## Admin Atama

```sql
update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                           || jsonb_build_object('role', 'admin')
 where email = 'admin@wellnur.com';
```

Sonrasında kullanıcı tekrar login olduğunda JWT'sinde `app_metadata.role: "admin"` olacak ve `/admin` rotasına erişebilecek.

## Storage Bucket

`products` adında **public** bir bucket oluşturun. Policies `002_rls_policies.sql` içinde tanımlıdır.

## Edge Functions

```bash
supabase functions deploy create-iyzico-payment
```

Iyzico API anahtarlarını secret olarak ekleyin:

```bash
supabase secrets set IYZICO_API_KEY=...
supabase secrets set IYZICO_SECRET_KEY=...
supabase secrets set IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```
