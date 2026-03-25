import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Rashod Korala's portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.",
  openGraph: {
    title: "Rashod Korala | Software Developer Portfolio",
    description:
      "Welcome to Rashod Korala's portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.",
  },
  twitter: {
    title: "Rashod Korala | Software Developer Portfolio",
    description:
      "Welcome to Rashod Korala's portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.",
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  tags: string[] | null;
}

const getRecentBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, excerpt, published_at, tags")
      .eq("status", "published")
      .or("target_app.eq.portfolio,target_app.eq.both")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
    return data || [];
  },
  ["blogs-home-preview"],
  { revalidate: 3600, tags: ["blogs-portfolio"] }
);

export default async function Index() {
  const [caseStudies, projects, blogs] = await Promise.all([
    getCachedCaseStudies(),
    getCachedAllProjects(),
    getRecentBlogs(),
  ]);

  const featuredCaseStudies = caseStudies.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-6">
            Software Developer
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05]">
            Building products
            <br />
            <span className="font-medium">that matter</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-black/50 dark:text-white/50 font-light max-w-2xl leading-relaxed">
            Full-stack engineer specializing in creating elegant, performant applications.
            Currently focused on building a startup reimagining how people interact with technology.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40 mb-3">
                Case Studies
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Selected <span className="font-medium">work</span>
              </h2>
            </div>
            <Link
              href="/work"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="space-y-0">
            {featuredCaseStudies.map((item) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className="block border-t border-black/10 dark:border-white/10 py-8 group"
              >
                <div className="grid md:grid-cols-[1fr_200px] gap-6 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {item.category && (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 uppercase tracking-[0.08em]">
                          {item.category}
                        </span>
                      )}
                      {item.tags?.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 uppercase tracking-[0.08em]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-2">
                      {item.title}
                      <ArrowUpRight className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </h3>
                    {item.summary && (
                      <p className="text-black/50 dark:text-white/50 mt-2 font-light max-w-xl">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {item.cover_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                      <Image
                        src={item.cover_url}
                        alt={item.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        sizes="200px"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/work"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mt-6 group"
          >
            View all case studies
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40 mb-3">
                Projects
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Things I&apos;ve <span className="font-medium">built</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="space-y-0">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block border-t border-black/10 dark:border-white/10 py-8 group"
              >
                <div className="grid md:grid-cols-[1fr_200px] gap-6 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] uppercase tracking-[0.08em] text-black/30 dark:text-white/30">
                        {project.created_at
                          ? new Date(project.created_at).getFullYear()
                          : new Date().getFullYear()}
                      </span>
                      {project.tech?.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[11px] uppercase tracking-[0.08em] px-2 py-1 border border-black/10 dark:border-white/10 rounded-full text-black/40 dark:text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-2">
                      {project.title}
                      <ArrowUpRight className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </h3>
                    {project.subtitle && (
                      <p className="text-black/50 dark:text-white/50 mt-2 font-light max-w-xl">
                        {project.subtitle}
                      </p>
                    )}
                  </div>

                  {project.cover_image_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        sizes="200px"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/projects"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mt-6 group"
          >
            View all projects
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* Blog */}
      {blogs.length > 0 && (
        <section className="py-16 px-6 border-t border-black/5 dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40 mb-3">
                  The View
                </p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Recent <span className="font-medium">writing</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group"
              >
                Read all
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="space-y-0">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block border-t border-black/10 dark:border-white/10 py-8 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] text-black/30 dark:text-white/30 font-mono">
                      {post.published_at
                        ? new Date(post.published_at).getFullYear()
                        : new Date().getFullYear()}
                    </span>
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-1 border border-black/10 dark:border-white/10 rounded-full text-black/40 dark:text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-light tracking-tight flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </h3>
                  {post.excerpt && (
                    <p className="text-black/50 dark:text-white/50 mt-2 font-light max-w-2xl">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <Link
              href="/blog"
              className="sm:hidden inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mt-6 group"
            >
              Read all posts
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>
        </section>
      )}

      {/* About CTA */}
      <section className="py-24 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              Where curiosity
              <br />
              <span className="font-medium">meets execution</span>
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-black/60 dark:text-white/60 font-light leading-relaxed">
              A software engineer with a deep love for building products that solve real problems.
              Years of experience across the full stack, specializing in creating elegant,
              performant applications.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors group"
            >
              Learn more
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
