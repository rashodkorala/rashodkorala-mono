# Case Studies V2 - Complete Implementation Guide

## Overview

This implementation stores MDX content in Supabase Storage and metadata in the database, with a clean admin interface for management.

## Database Structure

### Table: `case_studies`

**Core Fields:**
- `id`, `user_id`, `title`, `slug`, `summary`
- `type` (problem-solving/descriptive)
- `status` (draft/published/archived)
- `featured`, `published_at`

**Subject & Context:**
- `subject_name`, `subject_type`, `industry`, `audience`

**Team & Timeline:**
- `role`, `team_size`, `timeline`

**Technical (JSONB):**
- `tags[]`, `skills[]`, `stack[]`

**Media:**
- `cover_url`, `gallery_urls[]`

**Proof (JSONB):**
- `links[]` - `{label, url}`
- `results[]` - `{text}`
- `metrics[]` - `{label, value}`

**MDX:**
- `mdx_path` - Reference to storage file

**SEO:**
- `seo_title`, `seo_description`

**System:**
- `views`, `created_at`, `updated_at`

### Storage Buckets

1. **case-studies-mdx** - Stores `.mdx` files
   - Path format: `{user_id}/{slug}.mdx`

2. **case-studies-media** - Stores images
   - Path format: `{user_id}/{timestamp}-{random}.{ext}`


## Workflow

### Creating a Case Study

1. Navigate to `/admin/case-studies/new`
2. Fill in metadata across 4 tabs
3. Write MDX content in textarea (or use Insert Template button)
4. Click Save
5. System uploads MDX to storage as `{user_id}/{slug}.mdx`
6. System saves metadata to database with `mdx_path`

### Editing a Case Study

1. Navigate to `/admin/case-studies/[slug]`
2. System loads metadata from database
3. System fetches MDX content from storage using `mdx_path`
4. Edit fields and MDX content
5. Click Save
6. System re-uploads MDX (upsert)
7. System updates metadata

## Form Structure

### Tab 1: Content
- Title *
- Slug *
- Summary
- MDX Body (large textarea)
  - Insert Template button
- Status (draft/published/archived)
- Published Date

### Tab 2: Details
- Subject Name
- Subject Type
- Industry
- Audience
- Role
- Timeline
- Team Size
- Type (problem-solving/descriptive)
- Tags (comma-separated or pills)
- Skills (comma-separated or pills)
- Stack (comma-separated or pills)

### Tab 3: Proof
- Results (list of text items)
  - Add/Remove buttons
- Metrics (list of label/value pairs)
  - Add/Remove buttons
- Links (list of label/URL pairs)
  - Add/Remove buttons

### Tab 4: Media
- Cover Image upload
- Gallery Images upload (multiple)

## Server Actions

### `uploadMdxToStorage(slug: string, content: string)`
Uploads MDX string to storage, returns path

### `fetchMdxFromStorage(mdxPath: string)`
Downloads MDX from storage, returns content string

### `uploadMedia(file: File)`
Uploads image to media bucket, returns public URL

### `createOrUpdateCaseStudy(formData, existingId?)`
Main action that:
1. Uploads MDX to storage
2. Upserts metadata to database
3. Revalidates paths

### `getCaseStudies(status?)`
Lists case studies for admin (filtered by user)

### `getCaseStudyBySlugAdmin(slug)`
Gets case study for editing (checks user ownership)

### `getCaseStudyBySlug(slug)`
Gets published case study for public view

### `deleteCaseStudy(id)`
Deletes from database and removes MDX from storage

## Public Pages

### `/case-studies`
Lists all published case studies with metadata cards

### `/case-studies/[slug]`
1. Loads metadata from database
2. Fetches MDX from storage using `mdx_path`
3. Renders with `next-mdx-remote`

## MDX Template

```mdx
# Overview
Context

# Problem
Goals

# Approach
What was done

# Challenges and Tradeoffs

# Results
Key takeaways

# Next Steps
Call to action (optional)
```

## Implementation Checklist

- [x] Database schema
- [x] Storage buckets
- [x] TypeScript types
- [x] Server actions
- [x] MDX template constant
- [ ] Admin list page
- [ ] Admin create page
- [ ] Admin edit page
- [ ] Form component with 4 tabs
- [ ] Public listing page
- [ ] Public detail page
- [ ] Update sidebar navigation

## Key Differences from V1

1. **MDX Storage**: Files in Storage, not database text field
2. **No File Upload**: Write MDX in textarea, not upload button
3. **JSONB Fields**: Arrays stored as JSONB (tags, skills, stack, links, etc.)
4. **Richer Metadata**: More fields for context and proof
5. **Admin Routes**: Separate `/admin/case-studies` area
6. **Template Button**: Insert pre-formatted MDX structure

## Security

- All admin routes check `auth.uid()`
- RLS policies enforce user ownership
- Storage policies require authentication for write
- Public can only read published case studies


