import { Metadata } from "next";
import SideNav from "@/src/components/side-nav";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Rashod Korala — Software developer, entrepreneur, and photographer based in St. John's, Newfoundland.",
  openGraph: {
    title: "Rashod Korala",
    description:
      "Software developer, entrepreneur, and photographer based in St. John's, Newfoundland.",
  },
};

const thingsIDo = [
  "Product discovery and validation for my startup",
  "Building the software (architecture, features, optimisation)",
  "Volunteering to support small business owners leverage technology to scale and grow",
  "Digital branding services for local brands and businesses",
  "Photography as a hobby (and occasional side gigs)",
  "Knowledge of business operations and strategies to boost ROI",
  "Understanding of product placement and merchandising",
  "Helping non-technical people understand technical solutions",
];

const socials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
  { label: "Email", href: "mailto:hello@rashodkorala.com" },
];

export default function Index() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SideNav />

      <main className="flex-1 flex items-center lg:ml-56 px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl w-full">

          {/* Left column — Name, bio, social */}
          <div className="flex flex-col justify-between min-h-[70vh] lg:min-h-0">
            <div className="space-y-10">
              {/* Name */}
              <h1 className="font-serif text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.95] tracking-tight">
                Rashod
                <br />
                Korala
              </h1>

              {/* Intro */}
              <div className="space-y-6 max-w-md">
                <p className="text-white/50 font-light leading-relaxed">
                  Hello, I&apos;m Rashod.
                  <br />
                  I&apos;m a software developer and entrepreneur based in
                  St. John&apos;s, Newfoundland. I build products, help businesses
                  grow with technology, and capture moments through photography.
                </p>

                {/* Things I do */}
                <div>
                  <p className="text-white/30 text-sm uppercase tracking-[0.15em] mb-4">
                    Things I do
                  </p>
                  <ul className="space-y-2">
                    {thingsIDo.map((item) => (
                      <li
                        key={item}
                        className="text-white/40 font-light text-[14px] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-px before:bg-white/20"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-8 pt-12">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="text-sm text-white/40 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right column — Photo */}
          <div className="relative aspect-[3/4] bg-white/[0.03] rounded-lg overflow-hidden border border-white/[0.06]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-[12rem] text-white/[0.03] select-none leading-none">
                R
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
