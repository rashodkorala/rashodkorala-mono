export interface AboutProfileDB {
  id: string
  user_id: string
  display_name: string | null
  headline: string | null
  bio_md: string
  location: string | null
  email_public: string | null
  avatar_url: string | null
  social_links: Array<{ label: string; url: string }> | null
  created_at: string
  updated_at: string
}

export interface AboutProfile {
  id: string
  userId: string
  displayName: string | null
  headline: string | null
  bioMd: string
  location: string | null
  emailPublic: string | null
  avatarUrl: string | null
  socialLinks: Array<{ label: string; url: string }>
  createdAt: string
  updatedAt: string
}

