# UI/UX Enhancement Project - School Performance Evaluation System

## 🎯 Project Overview

This is a **School Performance Evaluation System** for the Sultanate of Oman, built with Next.js 16 (App Router), TypeScript, PostgreSQL, and AWS S3. The system allows schools to upload and manage evidence of performance across multiple domains, with bilingual support (Arabic/English) and role-based access control.

**Current Status**: MVP is complete and functional. All core features are working. Now we need to enhance the UI/UX to match modern SaaS standards (Vercel, Stripe, Linear, Notion level).

---

## ✅ What Has Been Built (MVP - Complete)

### Core Infrastructure
- ✅ Next.js 16.0.3 with App Router
- ✅ TypeScript with strict mode
- ✅ PostgreSQL database with Prisma ORM
- ✅ NextAuth.js v5 authentication (JWT, 24-hour sessions)
- ✅ AWS S3 integration for file storage
- ✅ Bilingual support (Arabic/English) with RTL
- ✅ Dark mode support (next-themes)
- ✅ Custom i18n implementation

### Database Schema
- ✅ **Axis** → **Domain** → **Standard** → **Indicator** → **Evidence** hierarchy
- ✅ **User** model with roles (SYSTEM_MANAGER)
- ✅ **Evidence** model (FILE/LINK types, status: UNDER_REVIEW/APPROVED/REJECTED)
- ✅ **ActivityLog** for audit trail
- ✅ All models have bilingual fields (nameEn/nameAr, descriptionEn/descriptionAr)

### Authentication & Authorization
- ✅ Login page with email/password
- ✅ Protected routes with `requireAuth()` helper
- ✅ Role-based access control (`requireSystemManager()`)
- ✅ Session management
- ✅ Logout functionality

### Features Implemented

#### 1. Landing Page (`/[locale]/`)
- ✅ Public page displaying axes and domains from database
- ✅ Bilingual content
- ✅ Basic styling

#### 2. Dashboard (`/[locale]/dashboard`)
- ✅ Protected route
- ✅ Evidence statistics cards (Approved, Rejected, Under Review, Total)
- ✅ Evidence distribution by domain
- ✅ Recent evidence list
- ✅ Uses `AuthenticatedLayout` with sidebar

#### 3. Evidence Upload (`/[locale]/upload`)
- ✅ Protected route (all authenticated users)
- ✅ Form with cascading dropdowns:
  - Axis → Domain → Standard → Indicator
  - Shows selected hierarchy below each dropdown
- ✅ Evidence type toggle (FILE / LINK)
- ✅ File upload with drag-and-drop (react-dropzone)
  - Supports: PDF, Images, Video
  - Max size: 50MB
- ✅ URL input for LINK type
- ✅ S3 upload integration
- ✅ Activity logging
- ✅ Form validation
- ✅ Success/error handling

#### 4. Evidence List (`/[locale]/evidence`)
- ✅ Protected route
- ✅ Table view of all evidence
- ✅ Search functionality (title, description)
- ✅ Filters:
  - Status (UNDER_REVIEW, APPROVED, REJECTED)
  - Domain
- ✅ Pagination
- ✅ Download/Open buttons:
  - FILE type: Generates presigned S3 URL
  - LINK type: Opens URL directly
- ✅ Status badges with colors
- ✅ Bilingual table headers and content

#### 5. Evidence Review (`/[locale]/review`)
- ✅ Protected route (SYSTEM_MANAGER only)
- ✅ Two-column layout:
  - Left: List of evidence under review
  - Right: Review panel
- ✅ Approve/Reject functionality
- ✅ Optional review notes
- ✅ Updates evidence status
- ✅ Records reviewer and review date
- ✅ Activity logging
- ✅ View/download evidence from review panel

### API Routes

#### Authentication
- ✅ `/api/auth/[...nextauth]` - NextAuth endpoints

#### Evidence
- ✅ `GET /api/evidence` - Fetch evidence with filters and pagination
- ✅ `POST /api/evidence/upload` - Upload new evidence
- ✅ `GET /api/evidence/[id]/download` - Get download URL (presigned for S3, direct for links)
- ✅ `PATCH /api/evidence/[id]/review` - Update evidence status (SYSTEM_MANAGER only)

#### Cascading Dropdowns
- ✅ `GET /api/domains?axisId=...` - Get domains by axis
- ✅ `GET /api/standards?domainId=...` - Get standards by domain
- ✅ `GET /api/indicators?standardId=...` - Get indicators by standard

### Components

#### Layout Components
- ✅ `AuthenticatedLayout` - Shared layout with sidebar and top navigation
  - Sidebar navigation (Dashboard, Upload, Evidence, Reports, Users, Review)
  - Top bar with logout, theme toggle, language switch
  - RTL/LTR support
  - Responsive (sidebar on desktop, collapsible on mobile)

#### Form Components
- ✅ `LoginForm` - Email/password login
- ✅ `UploadEvidenceForm` - Complete evidence upload form with cascading dropdowns

#### List Components
- ✅ `EvidenceList` - Evidence table with filters and search
- ✅ `EvidenceReviewList` - Review interface for SYSTEM_MANAGER

#### UI Components
- ✅ `LanguageSwitch` - Toggle between Arabic/English
- ✅ `ThemeToggle` - Dark/light mode toggle
- ✅ `LogoutButton` - Logout functionality

#### Providers
- ✅ `SessionProvider` - NextAuth session provider
- ✅ `ThemeProvider` - Dark mode provider
- ✅ `TranslationProvider` - i18n provider

### Utilities

#### S3 Integration (`src/lib/upload.ts`)
- ✅ `uploadFileToS3()` - Upload files to S3
- ✅ `getPresignedDownloadUrl()` - Generate presigned URLs for downloads
- ✅ `isS3Configured()` - Check S3 configuration

#### Authentication (`src/lib/auth/`)
- ✅ `requireAuth()` - Require authentication
- ✅ `requireSystemManager()` - Require SYSTEM_MANAGER role
- ✅ `getCurrentUser()` - Get current user

#### Internationalization (`src/lib/i18n/`)
- ✅ Server-side translation loader
- ✅ Client-side translation hook
- ✅ Locale validation and routing

### Translation Files
- ✅ `public/locales/en/common.json` - English translations
- ✅ `public/locales/ar/common.json` - Arabic translations
- ✅ All UI text is bilingual

### Configuration Files
- ✅ `prisma/schema.prisma` - Complete database schema
- ✅ `S3-SETUP-GUIDE.md` - Comprehensive AWS S3 setup guide
- ✅ Environment variables configured (.env)

---

## 🎨 Current UI/UX State

### What Works
- ✅ All features are functional
- ✅ Responsive layout (basic)
- ✅ Dark mode works
- ✅ Bilingual support works
- ✅ RTL support for Arabic

### What Needs Improvement (UI/UX Enhancement Goals)

#### 1. Design System
- ❌ No consistent design system
- ❌ Inconsistent spacing and typography
- ❌ No shared component library (Button, Card, Input, etc.)
- ❌ Mixed styling approaches

#### 2. Visual Design
- ❌ Basic Tailwind utility classes (not polished)
- ❌ No modern gradients or subtle shadows
- ❌ Typography needs improvement (hierarchy, sizing)
- ❌ Color palette not consistently applied
- ❌ No professional icons (using emojis currently)

#### 3. Component Structure
- ❌ Some components are too large (600+ lines)
- ❌ Not enough componentization
- ❌ Inline styles mixed with Tailwind
- ❌ No reusable UI primitives

#### 4. Layout & Spacing
- ❌ Inconsistent spacing (not using design tokens)
- ❌ No clear visual hierarchy
- ❌ Cramped layouts in some areas
- ❌ Missing whitespace

#### 5. User Experience
- ❌ No loading states (skeletons)
- ❌ Basic error messages
- ❌ No empty states
- ❌ No success animations/feedback
- ❌ Tables could be more polished

#### 6. Accessibility
- ❌ Missing aria labels
- ❌ Focus states not consistent
- ❌ Keyboard navigation could be better

---

## 🚀 What Needs to Be Done (UI/UX Enhancement)

### Primary Goals

1. **Create a Design System**
   - Shared components: Button, Card, Input, Label, PageHeader, Badge, etc.
   - Consistent spacing tokens (space-y-8, py-16, py-24)
   - Typography scale
   - Color palette with semantic names
   - Professional icons (replace emojis)

2. **Refactor All Pages**
   - Break down large components (< 200 lines)
   - Extract reusable UI components
   - Apply consistent spacing and typography
   - Improve visual hierarchy

3. **Enhance Visual Design**
   - Modern, minimal aesthetic (Vercel/Stripe level)
   - Soft gradients and subtle shadows
   - Large, clean typography
   - Plenty of whitespace
   - Professional iconography

4. **Improve User Experience**
   - Loading skeletons
   - Empty states
   - Success animations
   - Better error handling
   - Smooth transitions

5. **Component Breakdown**
   - Extract features into small, focused components
   - Create reusable patterns
   - No one-off inline styles

### Pages to Enhance

1. **Landing Page** (`/[locale]/page.tsx`)
   - Hero section
   - Feature cards
   - Better typography and spacing

2. **Dashboard** (`/[locale]/dashboard/page.tsx`)
   - Modern stat cards
   - Better charts section
   - Polished recent evidence list
   - Extract: StatsCard, ChartCard, RecentEvidenceCard

3. **Upload Page** (`/[locale]/upload/page.tsx`)
   - Cleaner form layout
   - Better file upload area
   - Improved validation feedback
   - Extract: FormField, FileUploadZone, TypeToggle

4. **Evidence List** (`/[locale]/evidence/page.tsx`)
   - Modern table design
   - Better filters UI
   - Improved search
   - Extract: EvidenceTable, FilterBar, SearchInput

5. **Review Page** (`/[locale]/review/page.tsx`)
   - Better two-column layout
   - Polished review panel
   - Improved evidence cards
   - Extract: ReviewCard, ReviewPanel, StatusButtons

6. **Authenticated Layout** (`components/layouts/authenticated-layout.tsx`)
   - Modern sidebar
   - Better navigation
   - Improved top bar
   - Extract: Sidebar, TopBar, NavItem

---

## 🎯 System Prompt for UI/UX Enhancement

```
You are an expert Senior Frontend Engineer + UI/UX Designer specializing in Next.js (App Router), Tailwind CSS, and highly polished SaaS interfaces similar to Vercel, Stripe, Linear, and Notion.

Your job is to implement, refactor, and improve UI with consistency, clarity, and modern design practices.

⭐ Design Philosophy You Must Follow

Always produce UI that is:

1. Modern & Minimal
   - Large clean typography
   - Plenty of whitespace
   - Soft gradients and subtle shadows only
   - Clear visual hierarchy
   - Smooth spacing (py-16, py-24, space-y-8)

2. Consistent
   - Use a design system with shared components (Button, Card, Input, Label, PageHeader, etc.)
   - No one-off inline styles unless necessary
   - Use Tailwind tokens consistently (colors, radius, spacing)
   - NOOOO FUCKING SILLY emojies, use icons professionally

3. Componentized
   - Pages should be small and declarative
   - Extract UI into reusable components
   - No page or component should exceed 150–200 lines
   - Break large sections into smaller components:
     - FeatureCard
     - StatsRow
     - DashboardSidebar
     - EmptyState
     - RecentActivityList

4. Responsive First
   - Mobile-first layouts
   - No horizontal overflow
   - Tables/cards must wrap gracefully
   - Use max-w-5xl mx-auto px-4 for main containers

5. Accessible
   - Use aria-* where needed
   - Buttons have proper cursor, focus, and disabled states
   - Inputs use labels

⭐ How You Must Work

When the user provides a page/component to refactor:

Step 1 — Analyze
Explain the problems: layout issues, spacing, readability, component-size, inconsistency, etc.

Step 2 — Propose a Layout Plan
Describe visually how the page should look using a structural plan:

Example:
[ PageHeader: title + subtitle + actions ]
[ Hero Section ]
[ Left column: text, features ]
[ Right column: code block ]
[ 3 Feature Cards in a row ]

Step 3 — Component Breakdown
List new components to create:
- FeatureCard.tsx
- StatsRow.tsx
- EmptyState.tsx
- DashboardHeader.tsx

Step 4 — Deliver Clean, Modern Final Code
- Pages only contain high-level layout
- Components are extracted and readable
- All styling uses Tailwind and the design system
- Code should be production-ready, clean, and polished
- Use best practices (semantic HTML, accessibility, responsiveness)

Step 5 — Always Use The Design System
- If the shared UI components exist, use them.
- If not, generate clean versions of:
  - <Button />
  - <Card />
  - <Input />
  - <Label />
  - <PageHeader />
- No inline custom buttons or random styling.

⭐ How to Handle Bugs

When the user reports a visual issue:
- Ask for the smallest relevant component/file
- Debug by focusing ONLY on the part causing the issue
- Fix spacing, alignment, or layout without rewriting unrelated sections

⭐ Tone & Output Rules

- Be concise
- No long explanations unless asked
- Format all code cleanly
- Always ensure the UI feels like a polished SaaS product

🔥 Summary (Internal Behavior)

- You create Stripe/Vercel-level UI using Tailwind
- You refactor pages by splitting them into small components
- You enforce consistent spacing, typography, and layout
- You guide the user visually with layout sketches
- You never produce messy or cramped UI
- You centralize design tokens and components
- You fix issues in the smallest possible scope
```

---

## 📁 Project Structure

```
ses-app/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Dashboard
│   │   │   ├── upload/
│   │   │   │   └── page.tsx          # Upload evidence
│   │   │   ├── evidence/
│   │   │   │   └── page.tsx          # Evidence list
│   │   │   ├── review/
│   │   │   │   └── page.tsx          # Review evidence (SYSTEM_MANAGER)
│   │   │   └── layout.tsx            # Locale layout
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── evidence/
│   │       │   ├── route.ts          # GET evidence list
│   │       │   ├── upload/route.ts   # POST upload
│   │       │   └── [id]/
│   │       │       ├── download/route.ts  # GET download URL
│   │       │       └── review/route.ts    # PATCH review
│   │       ├── domains/route.ts
│   │       ├── standards/route.ts
│   │       └── indicators/route.ts
│   ├── components/
│   │   ├── layouts/
│   │   │   └── authenticated-layout.tsx
│   │   ├── login-form.tsx
│   │   ├── upload-evidence-form.tsx
│   │   ├── evidence-list.tsx
│   │   ├── evidence-review-list.tsx
│   │   ├── language-switch.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── logout-button.tsx
│   │   └── providers/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts
│   │   │   └── session.ts
│   │   ├── i18n/
│   │   │   ├── config.ts
│   │   │   ├── server.ts
│   │   │   ├── client.ts
│   │   │   └── utils.ts
│   │   ├── upload.ts                 # S3 utilities
│   │   └── prisma.ts
│   └── types/
├── prisma/
│   └── schema.prisma
├── public/
│   └── locales/
│       ├── en/common.json
│       └── ar/common.json
└── .env
```

---

## 🔧 Technical Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma 6.19.0
- **Authentication**: NextAuth.js v5
- **File Storage**: AWS S3
- **Internationalization**: Custom i18n (i18next + react-i18next)
- **Theme**: next-themes
- **File Upload**: react-dropzone

---

## 🎨 Design Tokens (Current - Needs Refinement)

### Colors
- Primary: `#3B82F6` (azure blue)
- Success: `#10B981` (emerald green)
- Warning: `#F59E0B` (golden yellow)
- Error: `#EF4444` (rose red)

### Typography
- Currently using default Tailwind sizes
- Needs: Consistent scale, better hierarchy

### Spacing
- Currently inconsistent
- Needs: Design tokens (space-y-8, py-16, py-24, etc.)

---

## 📝 Key Patterns to Follow

### Server Components by Default
- Use `"use client"` only when needed (forms, hooks, interactivity)

### Bilingual Support
- Always check `locale` and use `nameEn` or `nameAr`
- Use translation keys from `common.json`

### Authentication
- Use `requireAuth()` for protected routes
- Use `requireSystemManager()` for admin-only routes

### File Handling
- FILE type: Upload to S3, store `filePath`
- LINK type: Store `url` directly
- Use presigned URLs for downloads

---

## 🚫 What NOT to Do

- ❌ Don't break existing functionality
- ❌ Don't change API routes (unless fixing bugs)
- ❌ Don't modify database schema
- ❌ Don't remove bilingual support
- ❌ Don't use emojis (use professional icons)
- ❌ Don't create components > 200 lines
- ❌ Don't use inline styles (use Tailwind)
- ❌ Don't break RTL support for Arabic

---

## ✅ What TO Do

- ✅ Create a design system with shared components
- ✅ Refactor pages into small, focused components
- ✅ Improve spacing, typography, and visual hierarchy
- ✅ Add loading states, empty states, success feedback
- ✅ Use professional icons (Lucide React, Heroicons, etc.)
- ✅ Ensure responsive design
- ✅ Improve accessibility
- ✅ Maintain bilingual support
- ✅ Keep dark mode working
- ✅ Preserve all existing functionality

---

## 🎯 Success Criteria

After UI/UX enhancement, the application should:

1. Look like a modern SaaS product (Vercel/Stripe level)
2. Have consistent design system throughout
3. Be fully responsive and accessible
4. Have smooth, polished interactions
5. Maintain all existing functionality
6. Be maintainable with small, focused components

---

## 📚 Additional Context

- **Seeded User**: `alahda2022@gmail.com` / `Admin@123` (SYSTEM_MANAGER)
- **Database**: PostgreSQL with seeded axes, domains, standards, indicators
- **S3 Setup**: See `S3-SETUP-GUIDE.md` for configuration
- **Development**: `npm run dev` on `http://localhost:3000`
- **Locale Routes**: All pages under `/[locale]/` (en/ar)

---

**Last Updated**: After MVP completion, before UI/UX enhancement
**Status**: Ready for UI/UX polish and design system implementation

