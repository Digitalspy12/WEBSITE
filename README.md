# Bento Agency Website

Welcome to the Bento Agency Website repository. This project is built using Next.js 16 (App Router), Supabase (Auth, PostgreSQL, Storage), and Tailwind CSS.

## 🔐 Admin Setup (Supabase)

To access the highly secure `/admin` dashboard, your Supabase user account must explicitly be granted the `admin` role via `app_metadata`. This cannot be done from the frontend for security reasons.

### How to Grant Admin Privileges
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard/projects).
2. Open your specific project.
3. Click on **SQL Editor** in the left sidebar.
4. Click **New Query**.
5. Copy and paste the following SQL command, replacing `your@email.com` with your actual login email:

```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"')
WHERE email = 'your@email.com';
```

6. Click **Run** (or `Cmd+Enter` / `Ctrl+Enter`).
7. You should see a "Success" message. You can now visit `localhost:3000/login` and authenticate successfully into the CMS!

---

## 🛠 Project Structure

- `app/admin/`: Secured admin dashboard routes (System Health, Errors, Timeline, Security Audit, CMS, Leads).
- `app/api/`: Edge API routes for health checks and querying secure logs.
- `app/login/`: Authentication gateway.
- `lib/supabase/`: Supabase client and server wrappers (`@supabase/ssr`).
- `db/schema.sql`: Master SQL schema file defining all tables, Row Level Security (RLS) policies, storage buckets, and initial content seeds.

## 🚀 Running Locally

First, ensure your `.env` file is populated with your Supabase URL and Anon Key.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
