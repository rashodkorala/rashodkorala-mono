import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Mail, Github, Linkedin } from "lucide-react";
import { Metadata } from "next";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import SideNav from "@/src/components/side-nav";

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

const getBlogs = unstable_cache(
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
    getBlogs(),
  ]);

  const recentWork = caseStudies.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="relative">
      <SideNav />

      {/* Main content — offset on large screens for side nav */}
      <div className="lg:ml-56">
        {/* Header */}
        <header className="pt-16 pb-24 px-6 md:px-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.15] mb-6">
              Rashod Korala
            </h1>
            <p className="text-lg text-white/50 font-light max-w-xl leading-relaxed">
              Full-stack engineer building elegant, performant applications.
              Currently focused on a startup reimagining how people interact with technology.
            </p>
            <div className="flex items-center gap-5 mt-6">
              <a href="mailto:hello@rashodkorala.com" className="text-white/40 hover:text-white transition-colors">
                <Mail className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </a>
              <a href="https://github.com/rashodkorala" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Github className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </a>
              <a href="https://linkedin.com/in/rashodk" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </header>

        {/* About */}
        <section id="about" className="px-6 md:px-12 pb-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
              About
            </h2>

            <div className="space-y-6 text-[17px] text-white/50 font-light leading-[1.8] max-w-2xl">
              <p>
                Five years of building web and mobile applications. A journey that started with
                curiosity about how things work, naturally leading to a deep connection with code
                and craft.
              </p>
              <p>
                Specializing in creating elegant, performant applications across the full stack.
                The belief is simple: the best software is invisible, working seamlessly,
                integrating into lives without friction.
              </p>
              <p>
                Beyond coding, time is spent building a startup, mentoring junior developers, and
                exploring new cities with a camera.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              {[
                { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Go", "Swift"] },
                { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
                { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "GraphQL"] },
                { category: "Cloud", items: ["AWS", "Kubernetes", "Docker", "CI/CD"] },
              ].map((skill) => (
                <div key={skill.category}>
                  <h3 className="text-sm text-white/30 uppercase tracking-[0.08em] mb-3">
                    {skill.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 border border-white/10 rounded-full text-[13px] text-white/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work / Case Studies */}
        <section id="work" className="px-6 md:px-12 pb-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
              Work
            </h2>

            <div>
              {recentWork.map((item) => (
                <Link
                  key={item.id}
                  href={`/work/${item.slug}`}
                  className="block border-t border-white/10 py-8 group"
                >
                  <div className="grid md:grid-cols-[1fr_180px] gap-6 items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {item.category && (
                          <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-white/60 uppercase tracking-[0.08em]">
                            {item.category}
                          </span>
                        )}
                        {item.tags?.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-white/30 uppercase tracking-[0.08em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-2xl font-light tracking-tight flex items-center gap-2">
                        {item.title}
                        <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      </h3>
                      {item.summary && (
                        <p className="text-white/40 mt-2 font-light leading-relaxed max-w-lg text-[15px]">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    {item.cover_url && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-white/10">
                        <Image src={item.cover_url} alt={item.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" sizes="180px" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {recentWork.length === 0 && (
                <p className="text-white/30 font-light py-8 border-t border-white/10">No case studies yet.</p>
              )}
            </div>

            {caseStudies.length > 3 && (
              <Link
                href="/work"
                className="inline-flex items-center gap-2 mt-4 text-sm text-white/40 hover:text-white transition-colors group"
              >
                View all work
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="px-6 md:px-12 pb-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
              Projects
            </h2>

            <div>
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block border-t border-white/10 py-8 group"
                >
                  <div className="grid md:grid-cols-[1fr_180px] gap-6 items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-[11px] uppercase tracking-[0.08em] text-white/25 font-mono">
                          {project.created_at
                            ? new Date(project.created_at).getFullYear()
                            : new Date().getFullYear()}
                        </span>
                        {project.tech?.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 border border-white/10 rounded-full text-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-2xl font-light tracking-tight flex items-center gap-2">
                        {project.title}
                        <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      </h3>
                      {project.subtitle && (
                        <p className="text-white/40 mt-2 font-light leading-relaxed max-w-lg text-[15px]">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                    {project.cover_image_url && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-white/10">
                        <Image src={project.cover_image_url} alt={project.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" sizes="180px" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-white/30 font-light py-8 border-t border-white/10">No projects yet.</p>
              )}
            </div>

            {projects.length > 3 && (
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 mt-4 text-sm text-white/40 hover:text-white transition-colors group"
              >
                View all projects
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="px-6 md:px-12 pb-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
              Blog
            </h2>

            <div>
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block border-t border-white/10 py-8 group"
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[11px] text-white/25 font-mono">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : ""}
                    </span>
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 border border-white/10 rounded-full text-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-light tracking-tight flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </h3>
                  {post.excerpt && (
                    <p className="text-white/40 mt-2 font-light leading-relaxed max-w-lg text-[15px]">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
              {blogs.length === 0 && (
                <p className="text-white/30 font-light py-8 border-t border-white/10">No posts yet.</p>
              )}
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-4 text-sm text-white/40 hover:text-white transition-colors group"
            >
              View all posts
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
