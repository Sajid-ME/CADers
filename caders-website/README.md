# CADers — Official Club Website & Portal

Official web platform for **CADers, Khulna University of Engineering & Technology (KUET)** — promoting engineering design, CAD education, and empowering the next generation of designers and engineers.

---

## 🌟 Key Features

### 🎓 Public Presence
- **Vibrant & Responsive Design**: Custom CAD blueprint grid styling, smooth animations via Framer Motion, and fluid typography.
- **Dynamic Content**: Live showcases for Milestones/Achievements (with interactive slideshow controls), Upcoming/Recent Events (with status badges), and Community Voices.
- **Accessible & Fast**: Strict accessibility standards, keyboard navigation, and native Light/Dark theme toggle with zero hydration flicker.
- **Anonymous Feedback System**: Rate-limited and sanitized feedback submission endpoint forwarding safely to Google Sheets.

### 🧑‍🎓 Student Portal (`/dashboard`)
- **Personalized Student Workspace**: Dynamic greeting with department & roll number, course count, and material metrics.
- **Course Material Access**: Categorized downloads (Lecture Slides, Homework, Classwork) backed by short-lived, secure Supabase signed URLs.
- **Clean Contextual Navigation**: Dedicated student workspace header with a 1-click CADers logo shortcut back to the public homepage.

### 🛡️ Admin Management Suite (`/admin`)
- **Single Unified Header**: Clean single-row contextual navigation (`Overview`, `Students`, `Enrollments`, `Materials`, `Events`, `Achievements`, `Voices`, `Login Logs`).
- **Student Management**: Automated username generator (`<surname><dept><roll>@caders.kuet`), auto password generation, and batch enrollment.
- **Course & File Management**: Direct PDF, PPT(X), DOC(X), ZIP uploads (up to 20MB) directly into private Supabase storage.
- **Event & Achievement Editor**: Real-time CRUD operations reflecting instantly on the public website.
- **Audit & Security Logs**: Tracks user logins with timestamps and user-agent metadata.

---

## 🔒 Security Architecture

- **Strict Content Security Policy (CSP)**: Hardened headers in `next.config.ts` blocking unauthorized scripts, framing, and object embeds.
- **Dev-Aware CSP**: Dynamically permits `'unsafe-eval'` and dev WebSockets only during development mode (`NODE_ENV !== 'production'`) for Turbopack HMR and React callstack reconstruction without compromising production security.
- **Rate Limiting & Sanitization**: IP-based cooldown limiter and HTML tag sanitization on the `/api/feedback` route to prevent spam and abuse.
- **Row-Level Security (RLS)**: Enforced across all Supabase Postgres tables ensuring students can only access materials for courses they are enrolled in.
- **Zero-Trust File Storage**: Storage buckets are strictly private; files are delivered via time-limited signed URLs (`3600s`).
- **Browser Extension Guard**: Includes `<meta name="darkreader-lock">` to prevent third-party DOM-injecting extensions from breaking React 19 hydration.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Server Actions, Turbopack)
- **Library**: [React](https://react.dev/) 19 & TypeScript 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS token system (Light & Dark mode)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (Auth, Postgres database, Storage, RLS)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- A free **Supabase** project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CADers.git
   cd CADers/caders-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file inside `caders-website/`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   FEEDBACK_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🔑 Environment Variables Reference

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server) | Anonymous public key for client requests (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only (Secret)** | Service role key for admin tasks (bypasses RLS; never prefix with `NEXT_PUBLIC_`) |
| `FEEDBACK_WEBHOOK_URL` | **Server Only (Secret)** | Google Apps Script URL proxying anonymous feedback entries |

---

## 🗄️ Supabase Database & Storage Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Under **Authentication → Providers → Email**, disable public sign-ups (accounts are generated by club administrators).
3. Under **Storage**, create a **private** bucket named `materials`.
4. Run the SQL schema and RLS policies below in your Supabase **SQL Editor**.

### Database Schema

```sql
-- 1. Profiles Table
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

-- 2. Courses Table
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  order_index int not null default 0
);

-- 3. Enrollments Table
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- 4. Materials Table
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  type text not null check (type in ('slide', 'hw', 'cw')),
  title text not null,
  file_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

-- 5. Events Table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  venue text not null,
  description text,
  created_at timestamptz not null default now()
);

-- 6. Achievements Table
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date text,
  created_at timestamptz not null default now()
);

-- 7. Community Voices Table
create table public.voices (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('moderator', 'faculty')),
  name text not null,
  designation text,
  message text not null,
  order_index int not null default 0
);

-- 8. Login Audit Logs Table
create table public.login_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  login_time timestamptz not null default now(),
  user_agent text
);
```

### Auto-Profile Creation Trigger

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

### Row-Level Security (RLS) Policies

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

-- Public content: readable by everyone, editable by admins
create policy "public read events"       on public.events       for select using (true);
create policy "public read achievements" on public.achievements for select using (true);
create policy "public read voices"       on public.voices       for select using (true);
create policy "admin write events"       on public.events       for all using (is_admin()) with check (is_admin());
create policy "admin write achievements" on public.achievements for all using (is_admin()) with check (is_admin());
create policy "admin write voices"       on public.voices       for all using (is_admin()) with check (is_admin());

-- Profiles: read own profile or full read for admins
create policy "read own or admin" on public.profiles for select
  using (id = auth.uid() or is_admin());

-- Courses: signed-in users read, admins manage
create policy "auth read courses"   on public.courses for select using (auth.role() = 'authenticated');
create policy "admin write courses" on public.courses for all using (is_admin()) with check (is_admin());

-- Enrollments: students read their own, admins manage all
create policy "read own enrollments" on public.enrollments for select
  using (student_id = auth.uid() or is_admin());
create policy "admin write enrollments" on public.enrollments for all
  using (is_admin()) with check (is_admin());

-- Materials: enrolled students read their course materials, admins manage all
create policy "read enrolled materials" on public.materials for select using (
  is_admin() or exists (
    select 1 from public.enrollments e
    where e.course_id = materials.course_id and e.student_id = auth.uid()
  )
);
create policy "admin write materials" on public.materials for all
  using (is_admin()) with check (is_admin());

-- Login Logs: users record their own logins, admins read all
create policy "insert own login" on public.login_logs for insert
  with check (user_id = auth.uid());
create policy "admin read logs" on public.login_logs for select using (is_admin());

-- Storage Bucket Policies ('materials')
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

### Initial Admin Setup

Create your first user in Supabase **Authentication → Users**, then promote them to `super_admin`:

```sql
update public.profiles set role = 'super_admin' where username = 'your-username';
```

---

## 📝 Feedback Google Sheet Setup

1. Create a Google Sheet to collect feedback responses.
2. In the sheet, navigate to **Extensions → Apps Script**.
3. Paste the following script:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), data.message, data.source || 'web']);
     return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
   }
   ```
4. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL and set it as `FEEDBACK_WEBHOOK_URL` in `.env.local`.
6. Update `FEEDBACK_SHEET_URL` in `app/admin/page.tsx` with your spreadsheet URL for the admin shortcut.

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Root Directory to `caders-website` (if deploying from a monorepo structure).
4. Add the four environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FEEDBACK_WEBHOOK_URL`
5. In Supabase **Authentication → URL Configuration**, set the Site URL to your live Vercel domain.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
