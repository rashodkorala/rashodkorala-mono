'use client'
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const socials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
];

const heroNameClass =
  "block font-serif font-bold leading-[0.88] tracking-[-0.025em] text-[clamp(2.5rem,min(11vw,11vh),10rem)] text-heading";

interface HomeHeroProps {
  imageSrc?: string;
}

export default function HomeHero({ imageSrc }: HomeHeroProps = {}) {
  return (
    <>
      <style>{`
        html, body { height: 100%; overflow: hidden; }
        * { box-sizing: border-box; }

        /* Offset content so fixed SideNav (12rem wide) doesn't overlap */
        @media (min-width: 1024px) {
          .hero-page { padding-left: 12rem; }
        }

        /* Nav links visible on mobile only — SideNav handles desktop */
        .hero-nav-links { display: flex; gap: clamp(20px, 3vw, 48px); list-style: none; margin: 0; padding: 0; }
        @media (min-width: 1024px) { .hero-nav-links { display: none; } }

        /* Single column + hide photo on small screens */
        @media (max-width: 700px) {
          .hero-right { display: none !important; }
        }
      `}</style>

      <div
        className="hero-page"
        style={{
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--color-page, #f0ede8)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Nav */}
        <nav style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "clamp(16px, 2.5vw, 36px) clamp(24px, 4vw, 72px)",
          width: "100%",
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 3vw, 44px)" }}>
            <ul className="hero-nav-links">
              <li><Link href="/work" style={{ fontSize: "clamp(12px, 1vw, 16px)", color: "#1a1a1a", textDecoration: "none", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", letterSpacing: "0.02em" }}>Work</Link></li>
              <li><Link href="/about" style={{ fontSize: "clamp(12px, 1vw, 16px)", color: "#1a1a1a", textDecoration: "none", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", letterSpacing: "0.02em" }}>About</Link></li>
              <li><Link href="/contact" style={{ fontSize: "clamp(12px, 1vw, 16px)", color: "#1a1a1a", textDecoration: "none", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", letterSpacing: "0.02em" }}>Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
          padding: "0 clamp(24px, 4vw, 72px) 0",
          gap: "clamp(16px, 2.5vw, 40px)",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {/* Left column */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
            paddingBottom: "clamp(20px, 2.5vw, 40px)",
          }}>
            <motion.h1
              style={{ marginBottom: "clamp(20px, 3vw, 48px)", lineHeight: 0.88 }}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className={heroNameClass}
                variants={reveal}
                custom={0.2}
              >
                Rashod
              </motion.span>
              <motion.span
                className={heroNameClass}
                style={{ paddingLeft: "clamp(28px, 4.5vw, 72px)" }}
                variants={reveal}
                custom={0.35}
              >
                Korala
              </motion.span>
            </motion.h1>

            <motion.div
              style={{
                maxWidth: "480px",
                paddingLeft: "clamp(2px, 0.5vw, 8px)",
              }}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                style={{
                  fontSize: "clamp(11px, 0.9vw, 15px)",
                  color: "#6b6b6b",
                  lineHeight: "1.75",
                  margin: "0 0 clamp(10px, 1.2vw, 18px) 0",
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  fontWeight: "400",
                }}
                variants={reveal}
                custom={0.55}
              >
                I&rsquo;m a software developer and entrepreneur based in St.&nbsp;John&rsquo;s,
                Newfoundland. I focus on building practical, scalable products and helping
                businesses use technology to grow with clarity and purpose.
              </motion.p>

              <motion.p
                style={{
                  fontSize: "clamp(11px, 0.9vw, 15px)",
                  color: "#6b6b6b",
                  lineHeight: "1.75",
                  margin: "0 0 clamp(16px, 2vw, 32px) 0",
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  fontWeight: "400",
                }}
                variants={reveal}
                custom={0.7}
              >
                My work spans product discovery, software architecture, digital strategy, and
                translating complex technical ideas into solutions that make sense for
                non-technical teams. I also explore photography as a creative outlet, capturing
                moments and perspectives that complement my work in technology.
              </motion.p>

              <motion.div
                style={{ display: "flex", gap: "clamp(16px, 2vw, 36px)" }}
                variants={reveal}
                custom={0.9}
              >
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "clamp(11px, 0.85vw, 14px)",
                      color: "#1a1a1a",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                      fontWeight: "500",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {social.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right column — photo fills full column height */}
          <div className="hero-right" style={{ minWidth: 0, overflow: "hidden" }}>
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#b0aca6",
                position: "relative",
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Rashod Korala"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 40vw, 35vw"
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #b8b4ae 0%, #888480 40%, #6a6764 70%, #9a9590 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <svg
                    viewBox="0 0 400 500"
                    style={{ width: "100%", height: "100%", position: "absolute" }}
                    preserveAspectRatio="xMidYMax meet"
                  >
                    <defs>
                      <radialGradient id="bg" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#c0bbb5" />
                        <stop offset="100%" stopColor="#7a7672" />
                      </radialGradient>
                      <radialGradient id="skin" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a09890" />
                        <stop offset="100%" stopColor="#706860" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="500" fill="url(#bg)" />
                    <ellipse cx="200" cy="460" rx="110" ry="80" fill="#5a5550" opacity="0.9" />
                    <rect x="120" y="300" width="160" height="180" rx="20" fill="#6a6560" opacity="0.85" />
                    <rect x="178" y="255" width="44" height="60" rx="10" fill="url(#skin)" opacity="0.9" />
                    <ellipse cx="200" cy="220" rx="72" ry="78" fill="url(#skin)" opacity="0.9" />
                    <ellipse cx="200" cy="172" rx="72" ry="48" fill="#3a3330" opacity="0.95" />
                    <path
                      d="M140 300 Q90 260 100 200 Q110 160 150 180 Q160 220 170 250"
                      stroke="#5a5550"
                      strokeWidth="38"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <ellipse cx="165" cy="235" rx="28" ry="22" fill="#7a7268" opacity="0.85" />
                    <path d="M138 232 Q155 240 172 228" stroke="#8a8278" strokeWidth="3" fill="none" opacity="0.7" />
                    <path d="M140 242 Q158 250 174 238" stroke="#8a8278" strokeWidth="2" fill="none" opacity="0.5" />
                    <ellipse cx="200" cy="210" rx="12" ry="7" fill="#2a2220" opacity="0.9" />
                    <ellipse cx="200" cy="209" rx="5" ry="4" fill="#1a1210" />
                    <rect x="220" y="290" width="28" height="50" rx="5" fill="#2a2220" opacity="0.8" />
                    <rect x="223" y="293" width="22" height="44" rx="3" fill="#3a3230" opacity="0.6" />
                  </svg>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          flexShrink: 0,
          display: "flex",
          gap: "clamp(16px, 2vw, 36px)",
          padding: "clamp(10px, 1.2vw, 20px) clamp(24px, 4vw, 72px) clamp(18px, 2.5vw, 36px)",
        }}>
          <span style={{
            fontSize: "clamp(11px, 0.85vw, 14px)",
            color: "#9b9690",
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            letterSpacing: "0.02em",
          }}>
            St. John&rsquo;s, NL
          </span>
        </footer>
      </div>
    </>
  );
}
