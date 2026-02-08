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
- **Other:** Framer Motion, Three.js (portfolio), MDX (CMS docs)

## Architecture

```
rashodkorala-mono/
├── apps/
│   ├── cms/                    # CMS Dashboard
│   │   ├── app/
│   │   │   ├── api/            # 7 API routes (projects, analytics, AI endpoints)
│   │   │   ├── auth/           # Auth pages (login, sign-up, forgot-password, confirm)
│   │   │   └── protected/      # Auth-required routes (dashboard, projects, case-studies, etc.)
│   │   ├── components/         # 31 component directories, 126+ files
│   │   ├── lib/
│   │   │   ├── actions/        # Server actions (projects, case-studies, photos, media, pages, analytics, blogs)
│   │   │   ├── supabase/       # Server client + middleware
│   │   │   └── types/          # TypeScript types for all entities
│   │   ├── database-*.sql      # 11 SQL schema/storage/function files
│   │   └── middleware.ts       # Auth middleware protecting /protected/* routes
│   │
│   ├── photos/                 # Photo Gallery
│   │   ├── app/
│   │   │   └── actions/        # Server action: getPhotos()
│   │   ├── utils/supabase/     # Server client (regular + admin + service account)
│   │   └── middleware.ts       # Auth middleware for /admin/* routes
│   │
│   └── portfolio/              # Portfolio Site
│       ├── app/                # Pages: /, /about, /contact, /projects, /projects/[slug]
│       └── lib/supabase.ts     # Singleton Supabase client
│
├── packages/
│   └── theView/                    # Shared blog components package
│       ├── src/
│       │   ├── components/        # BlogPostContent component
│       │   ├── themes/            # Theme configs (portfolio, photos)
│       │   ├── utils/             # Markdown parser utility
│       │   └── types.ts           # Shared TypeScript types
│       └── package.json
│
└── pnpm-workspace.yaml
```

## Shared Packages

### `@rashodkorala/theView` (`packages/theView/`)

Shared package for blog post rendering components used across Portfolio and Photos apps.

**Purpose:** Consolidates blog rendering logic to avoid duplication and enable single-source-of-truth updates.

**Key Files:**
- `packages/theView/src/components/BlogPostContent.tsx` — Main blog post component with theme support
- `packages/theView/src/utils/markdownParser.ts` — Configurable markdown-to-HTML parser
- `packages/theView/src/themes/portfolio.ts` — Portfolio theme (light-only styling)
- `packages/theView/src/themes/photos.ts` — Photos theme (dark mode support)
- `packages/theView/src/types.ts` — Shared TypeScript interfaces

**Usage:**
```typescript
import { BlogPostContent, portfolioTheme } from "@rashodkorala/theView"
import type { BlogPost } from "@rashodkorala/theView"

<BlogPostContent blog={blog} theme={portfolioTheme} />
```

**Benefits:**
- Single source of truth for markdown parsing logic
- Consistent behavior across apps
- Theme-based styling allows each app to maintain unique design
- Easy to add new features or fix bugs in one place

## Key Files by Concern

### Authentication & Authorization
- `apps/cms/middleware.ts` — Protects `/protected/*` routes
- `apps/cms/lib/supabase/server.ts` — SSR Supabase client
- `apps/cms/lib/supabase/middleware.ts` — Session management (uses `getClaims`)
- `apps/photos/utils/supabase/server.ts` — Regular + admin + service account clients
- `apps/photos/utils/supabase/middleware.ts` — Protects `/admin/*` routes

### API Routes (CMS)
- `apps/cms/app/api/projects/route.ts` — GET published projects
- `apps/cms/app/api/projects/[slug]/route.ts` — GET project by slug
- `apps/cms/app/api/analytics/track/route.ts` — POST analytics events (CORS-enabled)
- `apps/cms/app/api/analyze-photo/route.ts` — POST image to OpenAI Vision
- `apps/cms/app/api/generate-project-content/route.ts` — POST AI content generation
- `apps/cms/app/api/generate-project-from-questions/route.ts` — POST AI questionnaire
- `apps/cms/app/api/case-studies/download-template/route.ts` — GET MDX template
- `apps/cms/app/auth/confirm/route.ts` — Email confirmation callback

### Server Actions (CMS)
- `apps/cms/lib/actions/projects.ts` — CRUD for projects (auth-gated)
- `apps/cms/lib/actions/case-studies.ts` — CRUD for case studies
- `apps/cms/lib/actions/photos.ts` — Photo metadata management
- `apps/cms/lib/actions/media.ts` — Media library
- `apps/cms/lib/actions/analytics.ts` — Analytics summary via RPC
- `apps/cms/lib/actions/pages.ts` — Page management
- `apps/cms/lib/actions/blogs.ts` — Blog post management

### Database Schemas
- `apps/cms/database-schema-projects.sql` — Projects table + RLS
- `apps/cms/database-schema-case-studies.sql` — Case studies + RLS
- `apps/cms/database-schema-analytics.sql` — Analytics + RLS + summary function
- `apps/cms/database-schema-media.sql` — Media library + RLS
- `apps/cms/database-schema-photos.sql` — Photos table
- `apps/cms/database-schema-blogs.sql` — Blog posts
- `apps/cms/database-schema-pages.sql` — Custom pages
- `apps/cms/database-storage-*.sql` — Storage bucket policies (3 files)

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

# Analytics (external tracking)
ANALYTICS_API_KEY
ANALYTICS_USER_ID
```

## Database Patterns

- All tables use UUID primary keys (`gen_random_uuid()`)
- Row Level Security (RLS) enabled on all tables
- User isolation via `user_id` column + `auth.uid()` checks
- Snake_case in DB, camelCase in TypeScript (transform functions in actions)
- JSONB used for arrays: tags, skills, stack, gallery_urls, metadata
- `updated_at` auto-updated via trigger on projects table

## Conventions

- Server actions use `"use server"` directive, located in `lib/actions/`
- Types split into DB format (`*DB`) and app format, in `lib/types/`
- Components use shadcn/ui patterns with `cn()` for className merging
- Image optimization: AVIF/WebP formats, responsive sizes, 60s cache TTL
- Auth: Supabase SSR with cookie-based sessions, middleware enforces protected routes
- Shared components: Use workspace packages (`packages/*`) for code shared across multiple apps
- Blog rendering: Use `@rashodkorala/theView` package for blog post components (Portfolio and Photos)
