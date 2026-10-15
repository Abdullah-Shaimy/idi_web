# Institute of Da'wa Islamiyya (IDI) - Web Portal

Official responsive web platform and administrative portal for the **Institute of Da'wa Islamiyya (IDI)** — an institution dedicated to Qur'anic memorization (Hifz), Islamic values, and academic excellence.

---

## 🌟 Key Features

- **Public Website Pages**:
  - **Home** (`index.html`): Hero slider, mission, quick navigation, and highlights.
  - **About** (`about.html`): History, vision, mission, and bilingual Tamil/English presentation.
  - **Hifz Program** (`hifz.html`): Curriculum, stages, and daily schedule.
  - **Students & Life** (`students.html`): Student activities, routines, and facilities.
  - **Alumni Network** (`alumni.html`): Graduate directory loaded from dynamic JSON data.
  - **Dynamic Photo Gallery** (`gallery.html`): Album folders and photos served from Supabase storage or local fallbacks.
  - **Contact & Inquiries** (`contact.html`): Direct database submission with status tracking.
  - **Results Lookup** (`result.html`): Protected, non-cacheable exam results portal.
  - **Custom 404** (`404.html`): Branded error page with helpful navigation.

- **Administrative Management Dashboard** (`/admin/dashboard.html`):
  - **Role-based Access Control**: Supports `super_admin` and `admin` roles.
  - **Gallery Management**: Create/delete photo folders, upload and manage WebP images directly into Supabase Storage.
  - **Inquiries Inbox**: Real-time review, status updates (`new`, `in_progress`, `resolved`), and internal admin notes.
  - **Admin User Management**: Invite, create, update, and revoke admin staff privileges (`super_admin` only).
  - **Direct Credentials Config**: Runtime Supabase configuration modal.

- **Security & Integrity**:
  - Modern Content Security Policy (CSP), anti-clickjacking (`X-Frame-Options: DENY`), and nosniff headers.
  - Client-side content protection (`js/security.js`).
  - Strict upload restrictions: Enforces WEBP image format and size constraints.
  - Server-level protection in `.htaccess` and `web.config` to prevent public downloads of `.env` and SQL schema dumps.

---

## 📁 Project Directory Structure

```text
├── admin/
│   ├── css/
│   │   └── admin.css            # Admin portal styling
│   ├── js/
│   │   └── admin.js             # Admin functionality and Supabase integration
│   ├── dashboard.html           # Admin operations dashboard
│   └── login.html               # Secure Supabase Auth login
├── assets/
│   └── images/                  # Institutional logos, hero backgrounds, and webp assets
├── css/
│   └── style.css                # Global site stylesheets and variables
├── data/
│   ├── alumni.json              # Alumni database records
│   ├── gallery.json             # Fallback gallery data
│   └── results.json             # Student examination records
├── js/
│   ├── alumni.js                # Alumni directory filtering
│   ├── gallery.js               # Public photo album viewer
│   ├── i18n.js                  # Multi-language translation engine (Tamil / English)
│   ├── main.js                  # Navigation, sliders, and UI interactions
│   ├── open.js                  # Open admissions script
│   ├── result.js                # Exam result lookup logic
│   ├── security.js              # Protection utilities
│   ├── students.js              # Students section logic
│   └── supabase-client.js       # Supabase database & storage client wrapper
├── .env                         # Local environment configuration (ignored by git)
├── .env.example                 # Environment configuration template
├── .gitignore                   # Version control ignore rules
├── .htaccess                    # Apache server configuration & security headers
├── 404.html                     # Custom 404 Not Found error page
├── package.json                 # Project scripts and metadata
├── robots.txt                   # Web crawler and search engine guidelines
├── site.webmanifest             # PWA metadata
├── sitemap.xml                  # Search engine XML sitemap
├── supabase_schema.sql          # Complete Supabase PostgreSQL schema and RLS policies
└── web.config                   # IIS server configuration & security headers
```

---

## 🚀 Getting Started

### 1. Clone & Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Enter your Supabase Project URL and Anon Public Key inside `.env`.

### 2. Run Locally

You can run the site using any static web server:

```bash
# Using npm / npx
npm start
# OR
npx serve -l 5500 .
```

Navigate to `http://localhost:5500` in your browser.

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
- Both `.htaccess` (Apache) and `web.config` (IIS) include blocking rules preventing web access to `.env`, `.git`, and `supabase_schema.sql`.

---

## 📄 License

&copy; 2026 Institute of Da'wa Islamiyya. All rights reserved.
Developed by [NanoVext](https://abdullahshaimy.lk).
