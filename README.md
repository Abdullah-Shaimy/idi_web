# Institute of Da'wa Islamiyya (IDI) - Web Portal

Official responsive web platform and administrative portal for the **Institute of Da'wa Islamiyya (IDI)** — an institution dedicated to Qur'anic memorization (Hifz), Islamic values, and academic excellence. Built with **Next.js (App Router)**, **React**, **TypeScript**, and **Supabase**.

---

## 🌟 Key Features

- **Public Website Routes**:
  - **Home** (`/`): Hero slider, mission, quick navigation, and highlights.
  - **About** (`/about`): History, vision, mission, and bilingual Tamil/English presentation.
  - **Hifz Program** (`/hifz`): Curriculum, stages, and daily schedule.
  - **Journey** (`/students`): Daily routines, student life, and spiritual journey.
  - **Alumni Network** (`/alumni`): Graduate directory loaded from dynamic JSON data.
  - **Events** (`/events`): Dynamic photo album folders and events served from Supabase storage or local fallbacks (with `/gallery` auto-redirect).
  - **Contact & Inquiries** (`/contact`): Direct database submission with status tracking.
  - **Results Lookup** (`/result`): Protected, non-cacheable exam results portal.
  - **Admissions Open** (`/open`): Special admissions announcement and portal.
  - **Custom 404** (`/_not-found`): Branded error page with helpful navigation.

- **Administrative Management Dashboard** (`/admin/dashboard`):
  - **Role-based Access Control**: Supports `super_admin` and `admin` roles.
  - **Gallery / Events Management**: Create/delete photo folders, upload and manage WebP images directly into Supabase Storage.
  - **Inquiries Inbox**: Real-time review, status updates (`new`, `in_progress`, `resolved`), and internal admin notes.
  - **Admin User Management**: Invite, create, update, and revoke admin staff privileges (`super_admin` only).
  - **Direct Credentials Config**: Runtime Supabase configuration modal.

- **Security & Integrity**:
  - Content Security Policy (CSP), anti-clickjacking (`X-Frame-Options: DENY`), and nosniff security headers in `next.config.mjs`.
  - Client-side content protection via React `<SecurityProvider>`.
  - Strict upload restrictions: Enforces WEBP image format and size constraints.

---

## 📁 Project Directory Structure

```text
├── app/                         # Next.js App Router pages and layouts
│   ├── about/                   # About page
│   ├── admin/                   # Admin portal (dashboard, login)
│   ├── alumni/                  # Alumni directory page
│   ├── contact/                 # Contact & inquiries page
│   ├── events/                  # Events & photo albums page
│   ├── gallery/                 # Redirect route to /events
│   ├── hifz/                    # Hifz program page
│   ├── management/              # Management page
│   ├── open/                    # Admissions open page
│   ├── result/                  # Exam results lookup
│   ├── students/                # Student journey page
│   ├── globals.css              # Global styles and responsive design
│   ├── layout.tsx               # Root layout & providers
│   └── page.tsx                 # Home page
├── components/                  # Modular React components
│   ├── about/                   # About section components
│   ├── alumni/                  # Alumni filter & cards
│   ├── contact/                 # Contact form & info
│   ├── gallery/                 # Events & album viewer
│   ├── hifz/                    # Hifz curriculum & stages
│   ├── home/                    # Home content & hero slider
│   ├── layout/                  # Header, Footer, Chrome, Security
│   ├── management/              # Management directory
│   ├── open/                    # Open portal
│   ├── result/                  # Result verification & lookup
│   └── students/                # Students journey content
├── context/                     # React Context providers (LanguageContext)
├── lib/                         # Core utilities, Supabase client, i18n data
│   ├── i18nData.ts              # Multi-language dictionary (Tamil / English)
│   └── supabaseClient.ts        # Supabase client wrapper & API methods
├── public/                      # Static assets & public data
│   ├── assets/images/           # WebP images & institutional graphics
│   ├── data/                    # JSON datasets (alumni, results, gallery)
│   ├── robots.txt               # Web crawler instructions
│   ├── site.webmanifest         # PWA metadata
│   └── sitemap.xml              # XML Sitemap with clean Next.js paths
├── .env                         # Environment variables (ignored by git)
├── .env.example                 # Environment variables template
├── next.config.mjs              # Next.js configuration & security headers
├── package.json                 # Project dependencies and scripts
├── supabase_schema.sql          # Supabase PostgreSQL schema and RLS policies
└── tsconfig.json                # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Enter your Supabase Project URL and Anon Public Key inside `.env.local`.

### 2. Run Locally

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Or build and start production server
npm run build
npm start
```

Navigate to `http://localhost:3000` in your browser.

---

## 🗄️ Supabase Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Open `supabase_schema.sql` from this repository, copy its contents, and execute the script.
   - This sets up tables (`gallery_folders`, `gallery_photos`, `admin_users`, `contact_inquiries`).
   - Configures Row Level Security (RLS) policies.
   - Creates the `gallery` storage bucket with appropriate access permissions.
4. Go to **Authentication -> Users** and create your initial admin user.
5. In the `admin_users` table, insert a row matching that user's ID with `role = 'super_admin'`.

---

## 🔒 Security Best Practices

- Never commit `.env` or production credentials to GitHub.
- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly confidential. The client frontend only uses the public `SUPABASE_ANON_KEY`.

---

## 📄 License

&copy; 2026 Institute of Da'wa Islamiyya. All rights reserved.
Developed by [NanoVext](https://nanovext.com).
