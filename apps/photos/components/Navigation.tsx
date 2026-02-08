"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/#gallery" },
    { name: "The View", path: "/blog" },
    { name: "Contact", path: "/#contact" },
];

const Navigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("about");

    useEffect(() => {
        if (pathname !== "/") {
            setActiveSection("");
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight * 0.35;
            const sections = document.querySelectorAll<HTMLElement>("section[id]");
            let found = false;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const id = section.getAttribute("id");

                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition < sectionTop + sectionHeight
                ) {
                    setActiveSection(id || "");
                    found = true;
                }
            });

            if (!found) {
                setActiveSection("about");
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        if (!path.startsWith("/#")) {
            return;
        }

        e.preventDefault();
        const targetId = path.substring(2);

        if (pathname !== "/") {
            router.push(`/#${targetId}`);
            return;
        }

        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-background border-b border-border lg:border-b-0 lg:border-r lg:min-h-screen lg:w-80 flex-shrink-0 lg:sticky lg:top-0 relative"
        >
            {/* Theme Toggle for Mobile - Top Right */}
            <div className="absolute top-5 right-6 lg:hidden z-10">
                <ThemeToggle />
            </div>
            <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-between px-6 py-5 lg:p-10 h-full lg:min-h-screen">
                <div className="space-y-6 w-full">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-start justify-between gap-4"
                    >
                        <Link href="/" className="block">
                            <p className="text-sm uppercase tracking-[0.45em] text-muted-foreground w-full ">
                                Rashod Korala
                            </p>
                            <p className="text-2xl lg:text-3xl font-light tracking-tight text-foreground">
                                Photo Journal
                            </p>
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-sm text-muted-foreground max-w-xs leading-relaxed hidden lg:block"
                    >
                        Minimal stories told through light, shadow, and rhythm.
                        Based in St. John&apos;s, working worldwide.
                    </motion.p>

                    <nav className="flex justify-between md:justify-start items-center md:items-start w-full gap-5 lg:flex-col lg:gap-3 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
                        {navItems.map((item, index) => {
                            const isActive =
                                pathname !== "/"
                                    ? pathname === item.path.replace("/#", "/")
                                    : activeSection === item.path.substring(2);

                            return (
                                <motion.div
                                    key={item.path}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                >
                                    <Link
                                        href={item.path}
                                        onClick={(e) => handleClick(e, item.path)}
                                        className={`transition-colors ${isActive
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground/70"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="space-y-3 text-xs uppercase tracking-[0.3em] text-muted-foreground hidden lg:block"
                >
                    <p>Currently booking 2025</p>
                    <a
                        href="mailto:rashodkorala2002@gmail.com"
                        className="text-foreground hover:underline tracking-[0.2em]"
                    >
                        Email
                    </a>
                </motion.div>
            </div>
        </motion.aside>
    );
};

export default Navigation;