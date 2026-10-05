# CADers — Official Website

> **The official digital home of CADers — the engineering design club of Khulna University of Engineering & Technology (KUET).**

A modern, secure, and fully-managed web platform that showcases our achievements, publishes our events, hosts course materials for enrolled students, and gives our committee complete control over every piece of content — all without writing a single line of code.

---

## 🌟 Why This Website Matters

CADers has always been about more than software — it's about shaping how engineers think, design, and solve problems. This website brings that mission online with:

- **A polished, modern identity** — Material Design 3 UI with smooth animations, dark mode, and full responsiveness across every device.
- **Effortless content management** — Committee members update events, achievements, courses, materials, and voices through a beautiful admin panel. No developers needed.
- **A secure student portal** — Enrolled students sign in with unique credentials to access their course materials, slides, homework, and classwork.
- **Bulletproof privacy** — Feedback is anonymous and gated to enrolled students and committee members only. No spam. No leaks.
- **Real-time feedback** — Every response lands instantly in a live Google Sheet, ready for review.
- **Zero hosting costs** — Deployed entirely on free tiers (Vercel + Supabase), scaling comfortably to hundreds of students.

This isn't just a website. It's the digital backbone of everything CADers does.

---

## ✨ Feature Highlights

### 🌐 Public Site
| Feature | Description |
|---------|-------------|
| **Hero landing** | Eye-catching animated hero with a call to action. |
| **Achievements slideshow** | Auto-rotating showcase of CADers' proudest milestones. |
| **Events listing** | Upcoming and past events with dates and venues. |
| **Voices from leadership** | Rotating quotes from the Moderator and Faculty Advisor. |
| **Contact & Map** | Full contact info + embedded Google Map. One click opens directions. |
| **Feedback form** | Anonymous, gated to enrolled students and committee members. |
| **Dark / Light mode** | Persistent theme preference, respects OS settings, no flash on load. |

### 🎓 Student Portal
| Feature | Description |
|---------|-------------|
| **Secure login** | Unique `username@caders.kuet` credentials, assigned by admins. |
| **Enrolled courses** | See only the courses you're enrolled in. |
| **Course materials** | Download slides, homework, and classwork securely. |
| **Session security** | Row-level security ensures students never see another student's data. |

### 🛠️ Admin Panel
| Feature | Description |
|---------|-------------|
| **Student management** | Create students with auto-generated passwords, view them all, delete when needed. |
| **Smart username generation** | Username auto-builds from name + department + roll (e.g. `sajidme021@caders.kuet`). |
| **Course management** | Create courses, enroll students, remove enrollments. |
| **Material uploads** | Upload PDFs, PPTX, DOCX, ZIP up to 20 MB with download links. |
| **Events CRUD** | Add and delete events; public site updates instantly. |
| **Achievements CRUD** | Manage the achievement slideshow without touching code. |
| **Voices CRUD** | Update moderator/faculty quotes anytime. |
| **Login logs** | See who logged in, when, from what device. |
| **Feedback shortcut** | One-click link to the live Google Sheet. |

---

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router, TypeScript, Turbopack) |
| Styling | **Tailwind CSS** with Material Design 3 tokens |
| Animations | **Framer Motion** |
| Icons | **Lucide React** |
| Auth + DB | **Supabase** (Postgres, RLS, Storage) |
| Feedback | **Google Apps Script** → **Google Sheets** |
| Hosting | **Vercel** (free tier) |
| Version Control | **GitHub** |

**Total hosting cost: $0/month** at CADers' scale.

---

## 🚀 Running Locally

```bash
# 1. Install Node.js (LTS) — https://nodejs.org

# 2. Navigate to the project
cd /d D:\Website\CADers\caders-website       # Windows
# or
cd ~/path/to/caders-website                  # macOS / Linux

# 3. Install dependencies (first time only)
npm install

# 4. Create a .env.local file (see below)

# 5. Start the dev server
npm run dev