# Agent README - School Performance Evaluation System

## 🎯 Project Overview

This is a **School Performance Evaluation System** for the Sultanate of Oman, built with Next.js 16 (TypeScript) and PostgreSQL. The system allows schools to upload and manage evidence of performance across multiple domains, with bilingual support (Arabic/English) and role-based access control.

### Key Requirements (from PDF documentation)
- User-friendly dashboard showing evidence statistics (approved, under review, rejected)
- Upload evidence (files or links) for specific standards and indicators
- Review workflow (approve/reject with comments)
- Filtering and search by domain, status, standard, indicator
- Reports with Excel export
- User management (system manager creates users, no public sign-up)
- Activity logging
- AI-assisted features (future)
- Bilingual interface (Arabic/English) with RTL support
- Dark mode

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Internationalization**: i18next + react-i18next (custom implementation)
- **Theme**: next-themes (dark mode)
- **Authentication**: NextAuth.js v5 (JWT strategy, 24-hour sessions)

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma 6.19.0
- **Password Hashing**: bcryptjs
- **API Routes**: Next.js API routes

### Project Structure
```
ses-app/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-aware routes (en/ar)
│   │   │   ├── page.tsx       # Landing page (public, shows axes/domains)
│   │   │   ├── login/         # Login page
│   │   │   ├── dashboard/     # Dashboard (protected, evidence stats)
│   │   │   └── layout.tsx     # Locale layout (sets lang, dir, providers)
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/  # NextAuth endpoints
│   │   └── page.tsx           # Root redirect to /en
│   ├── components/
│   │   ├── providers/         # React context providers
│   │   │   ├── session-provider.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── translation-provider.tsx
│   │   ├── login-form.tsx
│   │   ├── logout-button.tsx
│   │   ├── language-switch.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── auth/              # Authentication logic
│   │   │   ├── config.ts      # NextAuth configuration
│   │   │   └── session.ts     # getCurrentUser, requireAuth helpers
│   │   ├── i18n/              # Internationalization
│   │   │   ├── config.ts      # Locale constants
│   │   │   ├── server.ts      # Server-side translation loader
│   │   │   ├── client.ts      # Client-side translation hook
│   │   │   └── utils.ts      # Locale validation helpers
│   │   └── prisma.ts          # Prisma client singleton
│   └── types/
│       └── next-auth.d.ts     # NextAuth type extensions
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Seed data (axes, domains, standards)
│   └── migrations/
├── public/
│   └── locales/
│       ├── en/
│       │   └── common.json    # English translations
│       └── ar/
│           └── common.json    # Arabic translations
└── .env                       # Environment variables
```

---

## 📊 Database Schema

### Key Models
- **Axis** → **Domain** → **Standard** → **Indicator** → **Evidence**
- **User** (roles: SYSTEM_MANAGER, PRINCIPAL, SUPERVISOR, DATA_ENTRY)
- **Evidence** (status: UNDER_REVIEW, APPROVED, REJECTED)
- **ActivityLog**

### Bilingual Storage Strategy
**Dual columns approach**: Each model stores both languages in the same table:
- `nameEn` / `nameAr`
- `descriptionEn` / `descriptionAr`

**Why**: Simple queries, fast lookups, easy to add more languages later.

**Usage in code**:
```typescript
const name = locale === "ar" ? item.nameAr : item.nameEn;
```

---

## 🔐 Authentication Flow

### Current Implementation
1. **No public sign-up** - System manager creates users via admin panel (future)
2. **Login**: User enters email/password → NextAuth validates → JWT session created (24 hours)
3. **Protected routes**: Dashboard checks `requireAuth()` → redirects to login if not authenticated
4. **Logout**: Clears session → redirects to landing page

### Seeded User
- Email: `alahda2022@gmail.com`
- Password: `Admin@123`
- Role: `SYSTEM_MANAGER`

---

## 🌍 Internationalization (i18n)

### How It Works
1. **Route structure**: All pages under `/[locale]/` (e.g., `/en/dashboard`, `/ar/dashboard`)
2. **Server-side**: Layout loads translations via `getServerTranslation(locale)`
3. **Client-side**: `TranslationProvider` hydrates translations to prevent mismatch
4. **Language switcher**: Preserves current route, only changes locale segment
   - `/en/dashboard` → `/ar/dashboard` (stays on same page)

### Translation Files
- `public/locales/{locale}/common.json`
- Keys organized: `app.*`, `navigation.*`, `actions.*`, `home.*`

### RTL Support
- Layout sets `dir="rtl"` for Arabic, `dir="ltr"` for English
- Tailwind handles RTL automatically

---

## 🎨 Styling Approach

### Current State
- **Basic Tailwind utility classes** (colors, spacing, borders, shadows)
- **Not fancy yet** - will improve styling later
- **Color palette** (from PDF):
  - Primary: `#3B82F6` (azure blue)
  - Success: `#10B981` (emerald green)
  - Warning: `#F59E0B` (golden yellow)
  - Error: `#EF4444` (rose red)

### Dark Mode
- Implemented via `next-themes`
- Uses Tailwind's `dark:` variant
- System preference detection enabled

---

## 📝 Development Workflow

### ⚠️ CRITICAL: How Code is Written

**DO NOT use code generation tools directly on files.**

**Instead:**
1. **Write code in chat** - Provide complete, ready-to-copy code blocks
2. **User reviews and copies manually** - User pastes code into their IDE
3. **Explain what each part does** - Include comments and explanations
4. **Wait for confirmation** - User tests and confirms before moving forward

### Why This Approach?
- User wants to understand and maintain the code
- User wants control over what gets written
- User can review and refine before committing

### Code Style Guidelines
- **TypeScript strict mode** - Full type safety
- **Server components by default** - Use `"use client"` only when needed
- **Async/await** - No callbacks
- **Error handling** - Try/catch with meaningful messages
- **Comments** - Explain complex logic
- **Consistent naming** - camelCase for variables, PascalCase for components

---

## ✅ What's Built So Far

### Completed Features
1. ✅ Next.js 16 + TypeScript setup
2. ✅ Tailwind CSS with color palette
3. ✅ Prisma + PostgreSQL integration
4. ✅ Database schema (all models with bilingual fields)
5. ✅ Seed data (3 axes, domains, standards - bilingual)
6. ✅ Internationalization (i18n) - English/Arabic
7. ✅ Locale-aware routing (`/[locale]/`)
8. ✅ Language switcher (preserves route)
9. ✅ Dark mode toggle
10. ✅ Landing page (public, shows axes/domains from DB)
11. ✅ Login page with form
12. ✅ NextAuth.js authentication
13. ✅ Protected dashboard route
14. ✅ Logout functionality
15. ✅ Dashboard with evidence statistics (counts by status)

### Current State
- **Landing page** (`/[locale]`): Public, displays 3 axes with domains
- **Login page** (`/[locale]/login`): Email/password form
- **Dashboard** (`/[locale]/dashboard`): Protected, shows evidence stats (approved, rejected, under review, total)

---

## 🚧 What's Next (Priority Order)

### Immediate Next Steps
1. **Evidence Upload** - Form to upload files/links for specific indicators
2. **Evidence List/View** - Display all evidence with filters
3. **Review Workflow** - Approve/reject evidence with comments
4. **User Management** - Admin panel to create/edit users (system manager only)
5. **Activity Log** - Display user activity history
6. **Reports** - Generate reports with Excel export
7. **Charts** - Add Chart.js/Recharts for visualizations
8. **Search/Filter** - Advanced filtering by domain, status, standard
9. **Ask the user if you dont have the idea about the structure how we add new evidence or go to shemce.prisma to get idea**
### Future Enhancements
- AI-assisted features (evaluative phrases, proficiency calculations)
- Email notifications
- File storage migration to S3
- Role-based access control (different dashboards per role)

---

## 🔧 Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ses_app?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

---

## 🐛 Known Issues / Gotchas

1. **SessionProvider must be client component** - Wrapped in `src/components/providers/session-provider.tsx`
2. **NextAuth types** - Extended in `src/types/next-auth.d.ts`
3. **Language switcher** - Uses `usePathname()` to preserve route
4. **Prisma client** - Singleton pattern in `src/lib/prisma.ts` to prevent multiple instances

---

## 📚 Key Files Reference

### Authentication
- `src/lib/auth/config.ts` - NextAuth configuration
- `src/lib/auth/session.ts` - `getCurrentUser()`, `requireAuth()` helpers
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API endpoint
- `src/components/login-form.tsx` - Login form component

### Internationalization
- `src/lib/i18n/server.ts` - Server-side translation loader
- `src/lib/i18n/client.ts` - Client-side translation hook
- `src/components/providers/translation-provider.tsx` - Translation context provider
- `src/components/language-switch.tsx` - Language switcher (preserves route)

### Database
- `prisma/schema.prisma` - All models with bilingual fields
- `prisma/seed.js` - Seed data (axes, domains, standards)
- `src/lib/prisma.ts` - Prisma client singleton

---

## 🎯 UI/UX Preferences

### From User Feedback
- **Simple, clean design** - Not fancy yet, will improve later
- **Professional look** - Educational tool, not playful
- **Bilingual everywhere** - All text must support en/ar
- **RTL support** - Proper Arabic layout
- **Dark mode** - System preference + manual toggle
- **Responsive** - Works on mobile/tablet/desktop

### Design Principles
- **Clarity over decoration** - Focus on functionality
- **Consistent color palette** - Use defined primary/success/warning/error
- **Accessible** - Proper labels, keyboard navigation
- **Fast** - Optimize queries, lazy load when possible

---

## 💡 Important Notes for New Agent

1. **Always write code in chat first** - Don't use file editing tools directly
2. **Explain what code does** - User wants to understand
3. **Wait for user confirmation** - Before moving to next step
4. **Follow existing patterns** - Match code style and structure
5. **Test assumptions** - If unsure, ask before implementing
6. **Preserve locale in URLs** - Always use `/[locale]/` structure
7. **Use bilingual fields** - Always check `locale` and select `nameEn` or `nameAr`
8. **Server components by default** - Only use `"use client"` when needed (forms, hooks, etc.)

---

## 🔄 Current Session Context

### Last Completed
- Authentication system fully working
- Login/logout flow functional
- Dashboard protected and showing stats
- Language switching preserves routes

### Next Immediate Task
- Evidence upload functionality
- Evidence list/view page
- Review workflow

---

## 📞 Quick Reference

### Common Patterns

**Server Component with Auth:**
```typescript
import { requireAuth } from "@/lib/auth/session";

export default async function Page() {
  const user = await requireAuth(); // Throws if not authenticated
  // ... rest of component
}
```

**Client Component with Translations:**
```typescript
"use client";
import { useTranslation } from "@/lib/i18n/client";

export function Component() {
  const { t } = useTranslation("common");
  return <div>{t("app.title")}</div>;
}
```

**Database Query with Localization:**
```typescript
const items = await prisma.domain.findMany();
const localized = items.map(item => ({
  ...item,
  name: locale === "ar" ? item.nameAr : item.nameEn,
}));
```

**Language-Aware Route:**
```typescript
// Always use /[locale]/ structure
router.push(`/${locale}/dashboard`);
```

---

## 🎓 Project Context

This system is based on a **live demo from a school in the Sultanate of Oman**. The Ministry of Education requires schools to document evidence across three main axes:
1. Quality of Learning Outcomes
2. Quality of School Processes  
3. Ensuring Quality

Each axis has domains, which have standards, which have indicators. Evidence is uploaded for specific indicators and reviewed by supervisors/principals.

You can see the data we pushed in db in "/School-Performance-Evaluation-System/ses-app/prisma/seed.js"
---

**Last Updated**: After authentication implementation
**Status**: Core infrastructure complete, ready for feature development

