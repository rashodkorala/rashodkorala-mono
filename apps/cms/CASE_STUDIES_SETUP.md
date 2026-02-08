# Case Studies Feature Setup

A comprehensive case studies feature for showcasing your personal projects in MDX format with clean separation between metadata (form) and narrative content (MDX).

## Features

✅ **Clean Form/MDX Separation** - Metadata in form, narrative in MDX  
✅ **Full CRUD Operations** - Create, read, update, and delete case studies  
✅ **MDX File Upload** - Upload your narrative content as .mdx files  
✅ **Two Case Study Types** - Problem-solving or Descriptive  
✅ **Rich Context** - Subject, industry, role, timeframe  
✅ **Links & Proof** - Demo links, repos, metrics, programs  
✅ **Cover Images** - Visual appeal with project covers  
✅ **Status Management** - Draft, published, archived states  
✅ **SEO Optimized** - Custom titles and descriptions  
✅ **View Tracking** - Monitor case study engagement  
✅ **Featured System** - Highlight your best work  

## Database Setup

Run the SQL scripts in your Supabase SQL Editor:

### 1. Create Case Studies Table

```sql
-- Run database-schema-case-studies.sql
```

This creates:
- `case_studies` table with all fields
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates

### 2. Create Storage Bucket

```sql
-- Run database-storage-case-studies-bucket.sql
```

This creates:
- `case-studies` storage bucket
- Storage policies for uploads and access

### 3. Create View Tracking Function (Optional)

```sql
-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_case_study_views(case_study_slug text)
RETURNS void AS $$
BEGIN
  UPDATE case_studies 
  SET views = views + 1 
  WHERE slug = case_study_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## File Structure

```
lib/
├── types/
│   └── case-study.ts          # TypeScript types
└── actions/
    └── case-studies.ts         # Server actions

components/
└── case-studies/
    ├── index.tsx               # Admin list component
    └── case-study-form.tsx     # Create/edit form

app/
├── protected/
│   └── case-studies/
│       ├── page.tsx            # Admin management page
│       └── loading.tsx         # Loading state
└── case-studies/
    ├── page.tsx                # Public listing page
    └── [slug]/
        └── page.tsx            # Individual case study page
```

## Usage

### Admin Panel (Protected)

Navigate to `/protected/case-studies` to manage your case studies:

1. **Create New** - Click "New Case Study" button
2. **Edit** - Click actions menu → Edit
3. **Delete** - Click actions menu → Delete
4. **View** - Click actions menu → View (published only)

## Form vs MDX Content

### What Goes in the Form (Metadata)

**If it's used for filtering, SEO, or layout → Form**

- Title, Slug, Overview
- Case study type (problem-solving/descriptive)
- Status and featured flag
- Subject name, Industry, Your role, Timeframe
- Cover image
- Demo/repo links
- Key metrics, Programs, CTA text
- SEO fields

### What Goes in MDX (Narrative)

**If it's story-driven content → MDX Body**

- Introduction/Overview narrative
- Background/Context details
- Problem statement and impact
- Methodology and approach
- Analysis (constraints, tradeoffs)
- Solution description
- Results and outcomes
- Conclusion and takeaways
- Any storytelling content

### Form Tabs

The form has 4 organized tabs:

#### 1. Content Tab
- **MDX File Upload** - Upload your .mdx or .md file  (required)
- **Title** - Case study title (required)
- **Slug** - URL-friendly slug (required)
- **Overview** - Short 1-2 sentence summary (required)
- **Type** - Problem-solving or Descriptive (required)

#### 2. Metadata Tab
- **Cover Image** - Project cover image
- **SEO Title** - Custom SEO title
- **SEO Description** - Meta description
- **Status** - Draft, Published, or Archived
- **Display Order** - Numeric ordering
- **Featured** - Mark as featured checkbox

#### 3. Context Tab
- **Subject Name** - Project, product, or company name
- **Industry** - Industry or domain
- **Your Role** - Your role in the project
- **Timeframe** - Project duration or dates

#### 4. Links & Proof Tab
- **Demo Link** - Live demo or website
- **Repo Link** - GitHub or documentation
- **Key Metrics** - Important numbers/results
- **Programs** - Accelerators, awards, validation
- **CTA Text** - Call to action message

### Public Pages

#### Case Studies Listing (`/case-studies`)
- Shows all published case studies
- Grid layout with cards
- Featured badge for featured studies
- Filter by client, industry, technologies
- Click to view full study

#### Individual Case Study (`/case-studies/[slug]`)
- Full MDX content rendering
- Challenge-Solution-Results cards
- Technologies badges
- Client testimonial section
- View tracking
- SEO metadata

## Writing MDX Content

Case studies support full MDX syntax:

### Basic Markdown

```mdx
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

![Image alt text](/path/to/image.jpg)
```

### GitHub Flavored Markdown

```mdx
| Feature | Status |
|---------|--------|
| MDX     | ✅     |
| Images  | ✅     |

~~Strikethrough~~

- [ ] Task list
- [x] Completed task
```

### Code Blocks

````mdx
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### Images

```mdx
![Project Screenshot](https://example.com/image.jpg)
```

## Server Actions

Available actions in `lib/actions/case-studies.ts`:

```typescript
getCaseStudies(status?: string): Promise<CaseStudy[]>
getPublishedCaseStudies(): Promise<CaseStudy[]>
getCaseStudy(id: string): Promise<CaseStudy | null>
getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>
createCaseStudy(caseStudy: CaseStudyInsert): Promise<CaseStudy>
updateCaseStudy(caseStudy: CaseStudyUpdate): Promise<CaseStudy>
deleteCaseStudy(id: string): Promise<void>
incrementCaseStudyViews(slug: string): Promise<void>
```

## TypeScript Types

```typescript
type CaseStudyStatus = "draft" | "published" | "archived"

interface CaseStudy {
  id: string
  userId: string
  title: string
  slug: string
  excerpt: string | null
  content: string // MDX content
  featuredImageUrl: string | null
  clientName: string | null
  clientLogoUrl: string | null
  industry: string | null
  projectDuration: string | null
  technologies: string[] | null
  challenge: string | null
  solution: string | null
  results: string | null
  testimonial: string | null
  testimonialAuthor: string | null
  testimonialRole: string | null
  status: CaseStudyStatus
  publishedAt: string | null
  featured: boolean
  orderIndex: number
  seoTitle: string | null
  seoDescription: string | null
  views: number
  createdAt: string
  updatedAt: string
}
```

## Customization

### Styling

The case study pages use:
- Tailwind CSS classes
- shadcn/ui components
- Responsive design
- Dark mode support

### MDX Plugins

Current plugins:
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-highlight` - Syntax highlighting

Add more in `app/case-studies/[slug]/page.tsx`:

```typescript
<MDXRemote
  source={caseStudy.content}
  options={{
    mdxOptions: {
      remarkPlugins: [remarkGfm, /* add more */],
      rehypePlugins: [rehypeHighlight, /* add more */],
    },
  }}
/>
```

## Best Practices

1. **Slugs** - Use descriptive, SEO-friendly slugs
2. **Images** - Optimize images before upload
3. **MDX** - Keep MDX content focused on story
4. **Metadata** - Fill out all relevant fields
5. **Order** - Use order_index to control display
6. **Featured** - Mark best work as featured
7. **SEO** - Always add SEO title and description
8. **Testimonials** - Include client feedback when possible

## Example Case Study

### Form Data:

**Content Tab:**
- Title: "Redesigning the User Onboarding Experience"
- Slug: "redesigning-user-onboarding"
- Overview: "How we reduced user drop-off from 40% to 8% by completely reimagining our onboarding flow"
- Type: Problem-solving
- MDX File: uploaded `onboarding-redesign.mdx`

**Metadata Tab:**
- Cover Image: uploaded
- Status: Published
- Featured: Yes
- Display Order: 1

**Context Tab:**
- Subject Name: "SaaS Platform Onboarding"
- Industry: "B2B SaaS"
- Your Role: "Lead Product Designer"
- Timeframe: "3 months (Q1 2024)"

**Links & Proof Tab:**
- Demo Link: "https://app.example.com/onboarding"
- Key Metrics: "Drop-off reduced 80%, Time to value down 75%"
- Programs: "Featured in Product Hunt #1"

### MDX File Content (onboarding-redesign.mdx):

```mdx
# Introduction

When we noticed a 40% drop-off rate in user onboarding, we knew we had a problem...

## Background

Our SaaS platform had been using the same onboarding for 3 years...

## Problem Statement

### Why This Mattered
- Losing 40% of signups = $500K annual revenue loss
- Support tickets increased 200%

### Who Was Affected
- New signups (primary)
- Customer success team
- Sales team

## Methodology

### Research
- 50 user interviews
- Analytics deep dive
- Competitive analysis of 20+ flows

### Approach
Tested 5 different prototypes with users

## Analysis

### Constraints
- Had to maintain essential data collection
- Couldn't break existing integrations
- 3-month timeline

### Tradeoffs
- Removed 8 of 12 steps
- Progressive disclosure over upfront setup
- Speed to value over feature education

## Solution

Built around three principles:
1. Progressive disclosure
2. Contextual help
3. Skip options

## Results

### What Changed
- Drop-off: 40% → 8%
- Time to value: 12 min → 3 min
- Support tickets: Down 65%

### What Worked
- User research revealed our assumptions were wrong
- Removing steps was better than improving them

### What Didn't
- Initial A/B test failed due to technical issues
- Had to rebuild analytics tracking

## Conclusion

### Key Takeaways
1. Talk to users early
2. Less is more
3. Measure everything

### What I'd Do Differently
- Start with qualitative research sooner
- Test more radical changes earlier
```

## Troubleshooting

### Images not displaying
- Check storage bucket exists: `case-studies`
- Verify storage policies are set
- Ensure URLs are correct in database

### MDX not rendering
- Check `next-mdx-remote` is installed
- Verify MDX content is valid
- Check browser console for errors

### Views not incrementing
- Ensure view tracking function exists
- Check RPC permissions in Supabase

## Next Steps

1. Run database migrations
2. Create your first case study
3. Publish and test
4. Share with clients
5. Monitor views and engagement

For more information, see the main [README.md](./README.md).


