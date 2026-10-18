`````

The site runs at http://localhost:3000.

---

## 🔐 Environment Variables

Create `.env.local` in the project root:

| Variable | Where it's used | Notes |
|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon key (RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS. Never expose or prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL` | Browser | Google Apps Script web-app URL for feedback |

---

## 🗄️ Supabase Setup

1. Create a project at https://supabase.com.
2. **Authentication → Providers → Email**: disable public sign-ups (accounts are created by admins only).
3. Run the SQL below in the SQL editor.
4. **Storage**: create a **private** bucket named `materials`.

### Schema

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  department text,
  roll_number text,
  role text not null default 'student'
    check (role in ('student', 'admin', 'super_admin')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  order_index int not null default 0
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  type text not null check (type in ('slide', 'hw', 'cw')),
  title text not null,
  file_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  venue text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date text,
  created_at timestamptz not null default now()
);

create table public.voices (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('moderator', 'faculty')),
  name text not null,
  designation text,
  message text not null,
  order_index int not null default 0
);

create table public.login_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  login_time timestamptz not null default now(),
  user_agent text
);
```

### Profile auto-creation

The admin panel creates users with metadata; this trigger turns that into a profile row:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name, department, roll_number, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'roll_number',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Row-Level Security

```sql
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

alter table public.profiles     enable row level security;
alter table public.courses      enable row level security;
alter table public.enrollments  enable row level security;
alter table public.materials    enable row level security;
alter table public.events       enable row level security;
alter table public.achievements enable row level security;
alter table public.voices       enable row level security;
alter table public.login_logs   enable row level security;

-- Public content: anyone reads, admins write
create policy "public read events"       on public.events       for select using (true);
create policy "public read achievements" on public.achievements for select using (true);
create policy "public read voices"       on public.voices       for select using (true);
create policy "admin write events"       on public.events       for all using (is_admin()) with check (is_admin());
create policy "admin write achievements" on public.achievements for all using (is_admin()) with check (is_admin());
create policy "admin write voices"       on public.voices       for all using (is_admin()) with check (is_admin());

-- Profiles: own row, or everything for admins
create policy "read own or admin" on public.profiles for select
  using (id = auth.uid() or is_admin());

-- Courses: signed-in users read, admins write
create policy "auth read courses"   on public.courses for select using (auth.role() = 'authenticated');
create policy "admin write courses" on public.courses for all using (is_admin()) with check (is_admin());

-- Enrollments: students see their own, admins manage all
create policy "read own enrollments" on public.enrollments for select
  using (student_id = auth.uid() or is_admin());
create policy "admin write enrollments" on public.enrollments for all
  using (is_admin()) with check (is_admin());

-- Materials: enrolled students and admins read, admins write
create policy "read enrolled materials" on public.materials for select using (
  is_admin() or exists (
    select 1 from public.enrollments e
    where e.course_id = materials.course_id and e.student_id = auth.uid()
  )
);
create policy "admin write materials" on public.materials for all
  using (is_admin()) with check (is_admin());

-- Login logs: users insert their own, admins read
create policy "insert own login" on public.login_logs for insert
  with check (user_id = auth.uid());
create policy "admin read logs" on public.login_logs for select using (is_admin());

-- Storage: files live at <course_id>/<type>/<file>
create policy "read enrolled files" on storage.objects for select using (
  bucket_id = 'materials' and (
    public.is_admin() or exists (
      select 1 from public.enrollments e
      where e.student_id = auth.uid()
        and e.course_id::text = (storage.foldername(name))[1]
    )
  )
);
```

### Creating the first admin

Create one user in **Authentication → Users**, then promote them:

```sql
update public.profiles set role = 'super_admin' where username = 'your-username';
```

If the user was created in the dashboard (not through the app), insert their profile row first.

---

## 📝 Feedback Sheet Setup

1. Create a Google Sheet for responses.
2. **Extensions → Apps Script**: add a `doPost(e)` function that parses `e.postData.contents` (JSON with `message` and `source`) and appends a row with a timestamp.
3. **Deploy → New deployment → Web app**, execute as you, access "Anyone".
4. Put the deployment URL in `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL`.
5. Update `FEEDBACK_SHEET_URL` in `app/admin/page.tsx` to your sheet's link.

---

## ☁️ Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add all four environment variables above (Production + Preview).
3. Build command is `npm run build` (already uses `next build --webpack`).
4. In Supabase **Authentication → URL Configuration**, set the Site URL to your Vercel domain.

---

## 📄 License

MIT — see [LICENSE](LICENSE).
`````

---

## Before you commit

`````bash
npm run lint && npm run build
`````

Two things to watch: the type change in `lib/data.ts` may surface TypeScript errors anywhere a component assumed `description`/`date`/`designation` was always a string, and the README's SQL should be checked against your actual policies, since if yours differ, the README should document what's really deployed.

When you're ready, the remaining items from the review are the feedback proxy (still the biggest security gap), batched signed URLs, and the revalidation/admin-delete guards.