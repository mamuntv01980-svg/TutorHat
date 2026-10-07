# 🎓 TutorHat (টিউটরহ্যাট)

> **Bangladesh's Premier Tuition Marketplace & Management Platform**  
> শিক্ষার্থী ও অভিভাবকদের জন্য বিশ্বস্ত টিউটর খোঁজা এবং টিউটরদের জন্য পছন্দের টিউশন খুঁজে পাওয়ার আধুনিক ডিজিটাল প্ল্যাটফর্ম।

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status?branch=main)](https://www.netlify.com)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 🌟 Features (মূল সুবিধাসমূহ)

- **🔍 Advanced Tutor Search & Filters:**
  - Search by subject, class/level, medium (Bangla, English Version, English Medium, Madrasah, etc.), location, area, gender, and budget.
  - View verified tutor badges, university credentials, experience, and ratings.

- **💼 Tuition Job Board:**
  - Real-time tuition requests posted by guardians with detailed class, subjects, salary, days, location, and requirements.
  - Multi-status workflow: `Draft`, `Pending Approval`, `Published`, `Paused`, `Filled`, `Cancelled`, `Expired`.

- **🛡️ Admin Control Center (অ্যাডমিন প্যানেল):**
  - **Job Management:** Create, approve, publish, pause, close, cancel, and assign tutors.
  - **Guardian Management:** Full directory, status toggling, suspension/reactivation, and private admin audit notes.
  - **Notice Board:** Create, categorize (General, Tutors, Guardians, Urgent), publish, and archive official announcements.
  - **Referral Tracking:** Track referral codes, referees, conversion status, and rewards.
  - **Contact Inbox:** Real-time messages submitted via contact form with mark-as-read/resolve and reply actions.
  - **Platform Settings:** Centrally configure platform name, phone, WhatsApp, email, office address, social links, and business rules without code changes.

- **🤝 Referral System:**
  - Unique shareable referral codes for all registered tutors and guardians with copy-link actions.

- **📞 Direct Call & WhatsApp Integration:**
  - One-tap phone calling (`+8809638284290`) and WhatsApp chat (`+8801752617360` via `https://wa.me/8801752617360`).

- **🌐 Bilingual Support (বাংলা ও English):**
  - Instant toggle between বাংলা (Default) and English across all public pages, forms, and user dashboards.

- **📱 Progressive Web App (PWA) & Mobile First:**
  - Responsive layout, bottom navigation for mobile, service worker caching, and installable on Android / iOS / Desktop.

---

## 🚀 Quick Start (লোকাল ডেভেলপমেন্ট)

### Prerequisites
- Node.js `18.0.0` or higher
- npm or bun

### 1. Clone repository
```bash
git clone https://github.com/your-username/tutorhat.git
cd tutorhat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## ⚡ Deployment to Netlify (নেটলিফাই ডিপ্লয়মেন্ট)

TutorHat is 100% ready for instant deployment on Netlify as a single-page application (SPA).

### Method A: Connect with GitHub (Recommended)
1. Push this repository to your **GitHub** account.
2. Log into [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** > **"Import an existing project"** > Choose **GitHub**.
4. Select the `tutorhat` repository.
5. The build settings are auto-detected from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. Click **Deploy tutorhat**. Your site will be live within seconds!

### Method B: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

> **Note on Client-Side Routing:**  
> Both `netlify.toml` and `public/_redirects` are pre-configured to redirect all routes (`/*`) to `/index.html` with status `200`, ensuring refreshing any page (e.g. `/jobs`, `/tutors`, `/dashboard`) works seamlessly.

---

## 📦 Project Structure

```
├── public/
│   ├── _redirects          # Netlify SPA redirect rules
│   ├── icon.svg            # TutorHat brand icon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker for offline caching
├── src/
│   ├── components/         # Reusable UI & common components
│   │   ├── common/         # Buttons, Modals, Banner, Language Switcher
│   │   └── layout/         # Header, Footer, MobileNav
│   ├── context/            # AppContext (Auth, Lang, Theme, Settings)
│   ├── pages/              # Main route views
│   │   ├── admin/          # Admin Dashboard & Sub-modules
│   │   ├── guardian/       # Guardian Dashboard & Tuition Request forms
│   │   ├── tutor/          # Tutor Dashboard & Multi-step Profile
│   │   ├── ContactPage.tsx # Contact & WhatsApp page
│   │   ├── JobsPage.tsx    # Tuition Job listings & filters
│   │   └── TutorsPage.tsx  # Tutor directory & filters
│   ├── services/           # Data store, state management & business logic
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── App.tsx             # Root application & routing
│   └── main.tsx            # Application entry point
├── .gitignore              # Git ignore rules (node_modules, dist, etc.)
├── netlify.toml            # Netlify build and routing configuration
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & plugin settings
```

---

## 🛠️ Build & Verification

To verify that the production build compiles without errors:

```bash
# Type check & lint
npm run lint

# Production build
npm run build

# Preview build locally
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License. Developed for the Bangladesh education community.
