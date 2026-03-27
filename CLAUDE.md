# CLAUDE.md — Codebase Guide for AI Agents

## Project Overview

pnpm monorepo with 3 Next.js apps sharing a Supabase (PostgreSQL) backend.

## Quick Reference

| App | Path | Port | Framework | Purpose |
|-----|------|------|-----------|---------|
| CMS | `apps/cms` | 3000 | Next.js 15.5.9 + React 19 | Content management dashboard |
| Photos | `apps/photos` | 3001 | Next.js 15.3.6 + React 19 | Photo gallery |
| Portfolio | `apps/portfolio` | 3002 | Next.js 15.0.5 + React 18 | Portfolio website |

## Commands

```bash
pnpm dev              # Run all apps
pnpm dev:cms          # CMS only (port 3000)
pnpm dev:portfolio    # Portfolio only
pnpm dev:photos       # Photos only
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm clean            # Remove .next dirs
pnpm clean:all        # Remove .next + node_modules
```

## Tech Stack

- **Runtime:** Node.js 18+, pnpm 9.0.0
- **Framework:** Next.js 15 (App Router), TypeScript 5
- **Styling:** Tailwind CSS, Radix UI / shadcn/ui (CMS)
- **Database:** Supabase PostgreSQL with RLS
- **Auth:** Supabase Auth (email/password)
- **AI:** OpenAI API (GPT-4o for vision, GPT-4o-mini for text)
- **Analytics:** PostHog (portfolio page views, events)
- **Other:** Framer Motion, Three.js (portfolio)

## Architecture

```
rashodkorala-mono/
├── apps/
│   ├── cms/                    # CMS Dashboard
│   │   ├── app/
│   │   │   ├── api/            # API routes (projects, AI endpoints)
│   │   │   ├── auth/           # Auth pages (login, sign-up, forgot-password, confirm)
│   │   │   └── protected/      # Auth-required routes (dashboard, work, case-studies, photos, media, about)
│   │   ├── components/         # UI component directories
│   │   ├── lib/
│   │   │   ├── actions/        # Server actions (projects, case-studies, photos, media, about, analytics)
│   │   │   ├── supabase/       # Server client + middleware
│   │   │   └── types/          # TypeScript types for all entities
│   │   └── middleware.ts       # Auth middleware protecting /protected/* routes
│   │
│   ├── photos/                 # Photo Gallery
│   │   ├── app/
│   │   │   └── actions/        # Server action: getPhotos()
│   │   ├── utils/supabase/     # Server client (regular + admin + service account)
│   │   └── middleware.ts       # Auth middleware for /admin/* routes
│   │
│   └── portfolio/              # Portfolio Site
│       ├── app/                # Pages: /, /about, /contact, /work, /work/[slug]
│       └── lib/supabase/       # Data layer: projects.ts, case-studies.ts + cached wrappers
│
├── packages/
│   └── theView/                    # Shared markdown rendering package
│       ├── src/
│       │   ├── utils/             # renderMarkdown() utility
│       │   └── types.ts           # Shared TypeScript types
│       └── package.json
│
└── pnpm-workspace.yaml
```

## Database Tables

Active tables (8 total):
- `projects` — Portfolio projects (renamed from projects_archived)
- `case_studies` — Case studies with inline `content_md` (no storage bucket for content)
- `case_study_projects` — Junction table linking case_studies → projects
- `photos` — Photography metadata
- `about_profiles` — About page content
- `media_library` — Centralized media asset registry
- `contact_submissions` — Contact form entries
- `page_views` — Page view tracking

## Storage

Single storage bucket: `media`

Folder structure within `media` bucket:
- `photography/` — Photo app images
- `projects/{slug}/` — Project cover/gallery images
- `case-studies/{slug}/cover/` — Case study cover image
- `case-studies/{slug}/assets/` — Case study gallery/inline images
- `about/` — About page images

**Important:** `content_md` (case study body) is stored inline in the DB, NOT in storage.

## Key Files by Concern

### Authentication & Authorization
- `apps/cms/middleware.ts` — Protects `/protected/*` routes
- `apps/cms/lib/supabase/server.ts` — SSR Supabase client
- `apps/cms/lib/supabase/middleware.ts` — Session management (uses `getClaims`)
- `apps/photos/utils/supabase/server.ts` — Regular + admin + service account clients
- `apps/photos/utils/supabase/middleware.ts` — Protects `/admin/*` routes

### API Routes (CMS)
- `apps/cms/app/api/projects/route.ts` — GET published projects (queries `projects` table)
- `apps/cms/app/api/projects/[slug]/route.ts` — GET project by slug
- `apps/cms/app/api/analyze-photo/route.ts` — POST image to OpenAI Vision
- `apps/cms/app/api/generate-project-content/route.ts` — POST AI content generation
- `apps/cms/app/api/generate-project-from-questions/route.ts` — POST AI questionnaire
- `apps/cms/app/auth/confirm/route.ts` — Email confirmation callback

### Server Actions (CMS)
- `apps/cms/lib/actions/projects.ts` — CRUD for projects table
- `apps/cms/lib/actions/case-studies.ts` — CRUD for case_studies table (content_md inline, cover/gallery stored as paths in media bucket)
- `apps/cms/lib/actions/photos.ts` — Photo metadata management
- `apps/cms/lib/actions/media.ts` — Media library (queries `media_library` table)
- `apps/cms/lib/actions/analytics.ts` — Analytics summary via RPC (PostHog handles tracking)
- `apps/cms/lib/actions/about.ts` — About page management

### Portfolio Data Layer
- `apps/portfolio/lib/supabase/projects.ts` — Queries `projects` table
- `apps/portfolio/lib/supabase/cached-projects.ts` — unstable_cache wrappers, tags: ['projects']
- `apps/portfolio/lib/supabase/case-studies.ts` — Queries `case_studies`, resolves cover_path → public URL
- `apps/portfolio/lib/supabase/cached-case-studies.ts` — unstable_cache wrappers, tags: ['case-studies']

### Configuration
- `apps/cms/next.config.ts` — MDX + image optimization config
- `apps/photos/next.config.ts` — Image domains
- `apps/portfolio/next.config.js` — Strict mode + image patterns
- `apps/cms/components.json` — shadcn/ui registry

## Environment Variables

```
# Required (all apps)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# CMS AI Features
OPENAI_API_KEY

# Photos App (server-only)
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ACCOUNT_EMAIL
SUPABASE_SERVICE_ACCOUNT_PASSWORD

# Analytics
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

## Database Patterns

- All tables use UUID primary keys (`gen_random_uuid()`)
- Row Level Security (RLS) enabled on all tables
- User isolation via `user_id` column + `auth.uid()` checks
- Snake_case in DB, camelCase in TypeScript (transform functions in actions)
- JSONB used for arrays: tags, skills, stack, gallery_paths, results, metrics, links
- `updated_at` auto-updated via trigger

## Conventions

- Server actions use `"use server"` directive, located in `lib/actions/`
- Types split into DB format (`*DB`) and app format, in `lib/types/`
- Components use shadcn/ui patterns with `cn()` for className merging
- Image optimization: AVIF/WebP formats, responsive sizes, 60s cache TTL
- Auth: Supabase SSR with cookie-based sessions, middleware enforces protected routes
- Shared packages: Use workspace packages (`packages/*`) for code shared across multiple apps
- Analytics: PostHog tracks page views and events on the portfolio — no custom analytics table
- Case study content: `content_md` stored directly in DB; use `renderMarkdown()` from `@rashodkorala/theView` to render it
- Media paths: case study cover/gallery images are stored as paths (not full URLs) in `cover_path` / `gallery_paths`; resolve via `supabase.storage.from('media').getPublicUrl(path)` before rendering
