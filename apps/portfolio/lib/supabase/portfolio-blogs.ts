import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

const REVALIDATE = 3600;
const TAGS = ["blogs-portfolio"];

export interface PortfolioBlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[] | null;
}

async function fetchPortfolioBlogsUncached(limit?: number): Promise<PortfolioBlogRow[]> {
  let query = supabase
    .from("blogs")
    .select("id, title, slug, excerpt, featured_image_url, published_at, author_name, category, tags")
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .order("published_at", { ascending: false });

  if (limit != null && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching portfolio blogs:", error);
    return [];
  }

  return (data || []) as PortfolioBlogRow[];
}

export async function getCachedPortfolioBlogs(limit?: number): Promise<PortfolioBlogRow[]> {
  const key = limit != null ? `portfolio-blogs-${limit}` : "portfolio-blogs-all";
  return unstable_cache(
    () => fetchPortfolioBlogsUncached(limit),
    [key],
    { revalidate: REVALIDATE, tags: TAGS }
  )();
}
