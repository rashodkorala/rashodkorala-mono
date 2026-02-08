# rashodkorala-mono

A monorepo containing personal portfolio, CMS, and photo gallery applications.

## Structure

```
rashodkorala-mono/
├── apps/
│   ├── cms/        # CMS dashboard with MDX documentation
│   ├── portfolio/  # Personal portfolio with 3D animations
│   └── photos/     # Photo gallery with Supabase auth
├── packages/       # Shared packages (future)
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run individual apps
pnpm dev:cms       # CMS at localhost:3000
pnpm dev:portfolio # Portfolio at localhost:3001
pnpm dev:photos    # Photos at localhost:3002
```

### Build

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:cms
pnpm build:portfolio
pnpm build:photos
```

## Apps

### CMS (`@rashodkorala/cms`)
Content management system with MDX documentation, analytics dashboard, and project management.

### Portfolio (`@rashodkorala/portfolio`)
Personal portfolio featuring Three.js 3D animations, Framer Motion, and React Spring.

### Photos (`@rashodkorala/photos`)
Photo gallery application with Supabase authentication and storage.

## Tech Stack

- **Framework:** Next.js 15+
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Database:** Supabase
- **Animation:** Framer Motion, Three.js
- **Package Manager:** pnpm
