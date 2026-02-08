# Case Studies - Full CRUD Operations

This document outlines the complete CRUD (Create, Read, Update, Delete) functionality for case studies.

## Routes

### Admin Routes (Protected)
All routes are under `/protected/case-studies` and require authentication.

| Route | Purpose | Method |
|-------|---------|--------|
| `/protected/case-studies` | List all case studies | READ |
| `/protected/case-studies/new` | Create new case study | CREATE |
| `/protected/case-studies/[slug]` | Edit case study | UPDATE |
| `/protected/case-studies/view/[slug]` | View case study (preview) | READ |
| - | Delete via actions menu | DELETE |

### Supporting Routes
- `/protected/case-studies/guide` - Writing guide
- `/api/case-studies/download-template` - Download MDX template

## CRUD Operations

### 1. CREATE (✅)
**Route**: `/protected/case-studies/new`

Features:
- 4-tab form (Content, Metadata, Context, Links & Proof)
- MDX content written directly in textarea
- Insert template button
- Cover image upload
- Dynamic arrays for tags, skills, tech stack
- Dynamic arrays for links, results, metrics
- Auto-slug generation from title

### 2. READ (✅)
**Routes**: 
- `/protected/case-studies` - List view
- `/protected/case-studies/view/[slug]` - Individual view

Features:
- Table with sortable columns
- Stats cards (Total, Published, Draft)
- Full case study preview with:
  - MDX content rendered with syntax highlighting
  - All metadata displayed
  - Tags, skills, tech stack
  - Links, metrics, results
  - Cover image
  - Status badges

### 3. UPDATE (✅)
**Route**: `/protected/case-studies/[slug]`

Features:
- Same form as CREATE
- Pre-populated with existing data
- MDX content fetched from storage
- Updates database and storage

### 4. DELETE (✅)
**Location**: Actions menu in table

Features:
- Confirmation dialog
- Deletes case study from database
- Deletes MDX file from storage
- Refreshes list after deletion

## Actions Menu (3-dot menu)

Located in the table on the list page. Provides quick access to:

1. **View** 👁️ - Preview the case study
2. **Edit** ✏️ - Edit the case study
3. **Delete** 🗑️ - Delete the case study (with confirmation)

## Components

### Main Components
- `app/protected/case-studies/page.tsx` - List page with table
- `app/protected/case-studies/new/page.tsx` - Create page
- `app/protected/case-studies/[slug]/page.tsx` - Edit page
- `app/protected/case-studies/view/[slug]/page.tsx` - View page

### Reusable Components
- `components/case-studies/case-study-form.tsx` - Form component
- `components/case-studies/case-study-actions.tsx` - Actions dropdown menu
- `components/ui/alert-dialog.tsx` - Confirmation dialog

## Server Actions

Located in `lib/actions/case-studies.ts`:

- `createOrUpdateCaseStudy()` - Create or update case study
- `getCaseStudies()` - Get all case studies for admin
- `getCaseStudy()` - Get single case study by ID
- `getCaseStudyBySlugAdmin()` - Get single case study by slug (admin)
- `deleteCaseStudy()` - Delete case study
- `uploadMdxToStorage()` - Upload MDX content to Supabase Storage
- `fetchMdxFromStorage()` - Fetch MDX content from Supabase Storage
- `uploadMedia()` - Upload images to Supabase Storage

## Database Setup

Run these SQL scripts in Supabase:

1. **Table**: `database-schema-case-studies.sql`
   - Creates `case_studies` table
   - Sets up RLS policies
   - Creates indexes and triggers

2. **Storage**: `database-storage-case-studies-bucket.sql`
   - Creates `case-studies-mdx` bucket
   - Creates `case-studies-media` bucket
   - Sets up storage policies

## Usage Flow

### Creating a Case Study
1. Click "New Case Study" button
2. Fill in metadata (title, type, status, etc.)
3. Write MDX content in textarea (or insert template)
4. Upload cover image (optional)
5. Add tags, skills, tech stack
6. Add links, results, metrics
7. Click "Create Case Study"
8. Redirects to list page

### Viewing a Case Study
1. Click 3-dot menu on any case study
2. Click "View"
3. See fully rendered case study with all metadata and content
4. Click "Edit" button to make changes

### Editing a Case Study
1. Click 3-dot menu and select "Edit", or
2. Click "View" then click "Edit" button
3. Modify any field
4. Click "Update Case Study"
5. Redirects to list page

### Deleting a Case Study
1. Click 3-dot menu on any case study
2. Click "Delete"
3. Confirm in dialog
4. Case study and MDX file are permanently deleted

## Security

- All routes require authentication
- RLS policies ensure users can only manage their own case studies
- Storage policies protect user files
- MDX files are public for published case studies
- Media files are public

## MDX Rendering

The view page uses:
- `next-mdx-remote` for runtime MDX rendering
- `remark-gfm` for GitHub Flavored Markdown
- `rehype-highlight` for syntax highlighting
- Custom components for styling

## Next Steps

- [ ] Add search/filter to list page
- [ ] Add pagination for large lists
- [ ] Add bulk actions (delete multiple)
- [ ] Add export functionality
- [ ] Add duplicate case study feature
- [ ] Add preview mode (unpublished preview URL)

