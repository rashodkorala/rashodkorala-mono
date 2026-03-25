# Content input specification (CMS / portfolio)

Use this document as **context for an LLM** (e.g. Claude) to draft or structure copy before you paste it into the CMS. Field names below match **what the app stores**; the CMS UI uses labels like “The View”, “Insight”, etc.

---

## How to use with an assistant

1. Pick a **content type** (§2–§8).
2. Ask the model to output **structured data** (Markdown body + metadata) using the **field lists** and **allowed values**.
3. For **case studies**, also ask for a long-form **MDX/Markdown body** following the **outline in §4.3** (aligned with the in-app template).

---

## 1. Content kinds (unified editor)

The CMS **blog editor** supports four kinds. Three of them save to the **`blogs`** table; one creates a **`case_studies`** row plus MDX in storage.

| Kind in UI              | Stored as                         | `blogs.category` (when applicable) |
|-------------------------|-----------------------------------|------------------------------------|
| **The View (blog)**     | `blogs`                           | Your free-text category (optional) |
| **Insight**             | `blogs`                           | Forced to `insight`                |
| **Project write-up**    | `blogs`                           | Forced to `project`                |
| **Case study**          | `case_studies` + MDX in storage   | N/A (not a blog row)               |

**Validation (editor):** `title` and body (`mdxContent`) are **required** for save. Slug is auto-derived from title if empty.

---

## 2. The View / Insight / Project write-up (`blogs` table)

These share the same **blog** fields. Differences are **category** (see §1) and how you position the piece (essay vs insight vs project narrative).

### 2.1 Fields

| Field                 | Type        | Required | Notes |
|----------------------|-------------|----------|--------|
| `title`              | string      | yes      |       |
| `slug`               | string      | no*      | *Derived from title if omitted |
| `excerpt`            | string      | no       | Short summary / deck text |
| `mdxContent`         | string (MD) | yes      | Main post body (Markdown); images as `![alt](url)` |
| `featuredImageUrl`   | string URL  | no       | Hero / card image |
| `featuredVideoUrl`   | string URL  | no       | Optional video |
| `status`             | enum        | no       | `draft` \| `published` \| `archived` (default `draft`) |
| `targetApp`          | enum        | no       | `portfolio` \| `photos` \| `both` (default `portfolio`) |
| `publishedAt`        | ISO datetime| no       | Often set when status is `published` |
| `authorName`         | string      | no       |       |
| `category`           | string      | no**     | **Free text for The View; fixed `insight` or `project` for the other kinds |
| `tags`               | string[]    | no       |       |
| `seoTitle`           | string      | no       |       |
| `seoDescription`     | string      | no       |       |
| `featured`           | boolean     | no       | Highlight on listings |

### 2.2 Prompt snippet for LLM

> Draft a blog post. Return: (1) `title`, (2) `excerpt` (1–2 sentences), (3) `tags` (array), (4) optional `seoTitle` and `seoDescription`, (5) full Markdown body with `##` sections. If this is an **Insight**, tone analytical; if **Project write-up**, tie to problem → approach → outcome.

---

## 3. Case study — dedicated form (`case_studies` + MDX)

**Two entry paths:** **Case Studies** section (full form) or **unified editor** with kind **Case study** (same data; unified path maps `excerpt` → `summary` and featured image → `coverUrl`).

### 3.1 Metadata fields (`CaseStudyFormData` / DB)

| Field            | Type   | Required | Notes |
|-----------------|--------|----------|--------|
| `title`         | string | yes      |       |
| `slug`          | string | yes      | URL-safe; often auto from title |
| `summary`       | string | no       | Short blurb (shown in listings) |
| `type`          | enum   | yes      | `problem-solving` \| `descriptive` |
| `status`        | enum   | yes      | `draft` \| `published` \| `archived` |
| `featured`      | bool   | yes      |       |
| `publishedAt`   | ISO string \| null | no | Set when publishing |
| `subjectName`   | string | no       | Client / product / subject name |
| `subjectType`   | string | no       | e.g. company, product, internal |
| `industry`      | string | no       |       |
| `audience`      | string | no       | Who the work was for |
| `role`          | string | no       | Your role |
| `teamSize`      | string | no       | e.g. “3 engineers” |
| `timeline`      | string | no       | e.g. “Q1–Q2 2025” |
| `tags`          | string[] | no     |       |
| `skills`        | string[] | no     |       |
| `stack`         | string[] | no     | Technologies |
| `coverUrl`      | URL \| null | no  | Cover image |
| `galleryUrls`   | string[] | no     | Extra images (dedicated form supports uploads) |
| `galleryVideoUrls` | string[] | no  | Video URLs |
| `links`         | `{ label, url }[]` | no | External links |
| `results`       | `{ text }[]` | no  | Short outcome bullets for UI chips |
| `metrics`       | `{ label, value }[]` | no | e.g. label “Conversion”, value “+12%” |
| `mdxContent`    | string | yes      | Full MDX body (stored in `case-studies-mdx` bucket) |
| `seoTitle`      | string | no       |       |
| `seoDescription`| string | no       |       |

### 3.2 Structured highlights vs narrative

- **MDX body:** long-form story (problem, approach, results, lessons).
- **Links / Results / Metrics:** scannable items for the portfolio layout; can mirror or extend the prose.

### 3.3 Suggested MDX outline (matches in-app template)

Use these top-level sections (headings can be adjusted, but keep the arc):

1. **Overview** — intro; optional note that form fields carry highlights.
2. **Context** — background.
3. **Problem** — include **Goals** (bullets).
4. **Approach** — **What was done**, **Key activities** (numbered list).
5. **Challenges and tradeoffs** — challenges + tradeoffs.
6. **Results** — prose + **Outcomes** + **Key takeaways**.
7. **Next steps** — optional **Call to action**.

### 3.4 Prompt snippet for LLM

> Produce a case study as JSON with keys: metadata (all fields in §3.1) and `mdxContent` (Markdown string using the outline in §3.3). Use `type` `problem-solving` unless the piece is purely descriptive. Populate `results` and `metrics` with 2–5 items each where numbers exist.

Example **shape** (values illustrative):

```json
{
  "title": "…",
  "slug": "…",
  "summary": "…",
  "type": "problem-solving",
  "status": "draft",
  "featured": false,
  "subjectName": "…",
  "industry": "…",
  "role": "…",
  "timeline": "…",
  "tags": ["…"],
  "stack": ["…"],
  "skills": ["…"],
  "links": [{ "label": "Live site", "url": "https://…" }],
  "results": [{ "text": "…" }],
  "metrics": [{ "label": "…", "value": "…" }],
  "seoTitle": "…",
  "seoDescription": "…",
  "mdxContent": "# Overview\n\n…"
}
```

---

## 4. Projects (`projects` table — portfolio)

Types exist in the codebase for a **structured project** record (used by portfolio APIs and types). **There is no separate “project form” file** in the repo at the time of this spec; use this as the **canonical schema** if you generate project copy or seed data.

| Field               | Type        | Notes |
|--------------------|-------------|--------|
| `slug`             | string      | Unique URL segment |
| `title`            | string      |       |
| `subtitle`         | string      | optional |
| `problem`          | string      | optional |
| `solution`         | string      | optional |
| `roles`            | string[]    | optional |
| `features`         | string[]    | optional |
| `tech`             | string[]    | optional |
| `liveUrl`          | URL         | optional |
| `githubUrl`        | URL         | optional |
| `caseStudyUrl`     | URL         | optional |
| `coverImageUrl`    | URL         | optional |
| `galleryImageUrls` | string[]    | optional |
| `galleryVideoUrls` | string[]    | optional |
| `category`         | enum        | `startup` \| `client` \| `personal` \| `school` |
| `status`           | enum        | `draft` \| `published` \| `archived` |
| `featured`         | boolean     |       |
| `sortOrder`        | number      | display order |

### Prompt snippet for LLM

> Draft one portfolio project: return JSON with keys matching the table above. Fill `problem` / `solution` in 2–4 sentences each; `features` as 4–8 bullets; `tech` as stack list.

---

## 5. Photos (`photos` table)

| Field            | Type        | Required | Notes |
|-----------------|-------------|----------|--------|
| `title`         | string      | no*      | *Can default from filename |
| `description`   | string      | no       |       |
| `imageUrl`      | URL         | yes      | After upload |
| `altText`       | string      | no       | Accessibility |
| `category`      | string      | no       |       |
| `location`      | string      | no       |       |
| `dateTaken`     | string      | no       | e.g. ISO date |
| `cameraSettings`| object      | no       | See below |
| `tags`          | string[]    | no       |       |
| `featured`      | boolean     | no       |       |
| `storyId`       | UUID \| null| no       | Link to a story |

**`cameraSettings` optional keys:** `aperture`, `shutterSpeed`, `iso`, `focalLength`, `camera`, `lens`.

---

## 6. Stories (`stories` table — photos app)

| Field           | Type   | Required |
|----------------|--------|----------|
| `title`        | string | yes      |
| `slug`         | string | yes      |
| `description`  | string | no       |
| `coverImageUrl`| URL    | no       |
| `published`    | bool   | no       |

---

## 7. Media library (`media` table)

| Field         | Type   | Notes |
|--------------|--------|--------|
| `title`      | string | required on insert |
| `description`| string | optional |
| `fileUrl`    | URL    | required |
| `fileType`   | enum   | `image` \| `video` \| `document` \| `audio` \| `other` |
| `fileSize`   | number | optional (bytes) |
| `mimeType`   | string | optional |
| `altText`    | string | optional |
| `tags`       | string[] | optional |
| `folder`     | string | optional (organizational) |
| `featured`   | bool   | optional |

---

## 8. Analytics events (API, not a manual form)

The track endpoint expects an **`AnalyticsEvent`** payload (e.g. `path`, event type, metadata). This is for instrumentation, not author-facing content.

---

## 9. Storage buckets (for context)

When the LLM suggests **image URLs**, authors still upload in the CMS; buckets are:

- **`media`** — general uploads (blog featured images from some flows, photos, library).
- **`blogs-mdx`**, **`blogs-media`** — blog markdown and blog media.
- **`case-studies-mdx`**, **`case-studies-media`** — case study MDX and assets.

---

## 10. Quick reference: what to ask Claude for

| Goal | Ask for |
|------|---------|
| Blog / The View post | Title, excerpt, tags, SEO, Markdown body, optional category |
| Insight | Same + tone = analytical; category = `insight` |
| Project write-up | Same + tie to delivery; category = `project` |
| Case study | Full §3.1 metadata JSON + §3.3 MDX string |
| Portfolio project card | §4 JSON |
| Photo metadata | §5 fields + caption story |
| Story (gallery) | §6 fields |

---

*Generated from `apps/cms/lib/types/*` and CMS forms (`case-study-form`, `blog-editor`). Regenerate or edit this file if types change.*
