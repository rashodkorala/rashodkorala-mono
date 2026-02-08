"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";

const About = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <div className="bg-background text-foreground transition-colors duration-300">
            <motion.section
                className="px-6 md:px-12 lg:px-16 py-12 border-b border-border"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center gap-10 w-full mb-8">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xs md:text-sm uppercase tracking-[0.35em] md:tracking-[0.45em] text-muted-foreground"
                    >
                        Rashod Korala — Photographer
                    </motion.p>
                    <div className="hidden md:block ml-auto md:ml-0">
                        <ThemeToggle />
                    </div>
                </div>
                <div className="max-w-5xl space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] font-light"
                    >
                        About Me
                    </motion.h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed space-y-4"
                        >
                            <span className="block">I want to make images that inspire me. Something honest. Something bold. Something that feels real.</span>
                            <span className="block">I was born in Sri Lanka, now based in Canada, and my camera has been with me every step of the way. From the vibrant chaos of Colombo&apos;s streets to the quiet beauty of the Canadian coast, I chase the moments that move me.</span>
                            <span className="block">Photography started as curiosity, a way to freeze time, to hold on to feeling, but it became something bigger. I&apos;ve gone from shooting local events and candid street stories to crafting visual narratives that reflect who I am and where I come from.</span>
                            <span className="block">Alongside my work as a software developer, I&apos;ve built a path in photography by sharing everything I learn. The growth. The grind. The gear. The good light. I believe in showing the journey, not just the highlights, because that&apos;s where the real magic lives.</span>
                            <span className="block">This isn&apos;t just about photos. It&apos;s about progress. And I&apos;m just getting started.</span>
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] overflow-hidden">
                                <Image
                                    src="/about.jpg"
                                    alt="Rashod Korala - Photographer"
                                    className="w-full h-full object-cover"
                                    width={500}
                                    height={600}
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="px-6 md:px-12 lg:px-16 py-16 border-b border-border"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-10"
                >
                    Expertise
                </motion.p>
                <div className="max-w-5xl space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-light max-w-3xl leading-tight"
                    >
                        My approach to photography.
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-3"
                        >
                            <h3 className="text-lg font-light text-foreground">Street Photography</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Capturing the essence of urban life and cultural moments in vibrant streets.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-3"
                        >
                            <h3 className="text-lg font-light text-foreground">Landscape Photography</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Showcasing the breathtaking natural beauty of diverse landscapes and seascapes.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="space-y-3"
                        >
                            <h3 className="text-lg font-light text-foreground">Cultural Documentation</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Preserving and sharing rich cultural heritage and traditions through photography.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="px-6 md:px-12 lg:px-16 py-16 flex flex-col gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-xs uppercase tracking-[0.45em] text-muted-foreground"
                >
                    Connect
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-light max-w-3xl leading-tight"
                >
                    Let&apos;s work together.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
                >
                    I&apos;m always excited to collaborate on new projects, share knowledge with fellow photographers, and connect with art enthusiasts. Whether you&apos;re interested in purchasing prints, commissioning work, or just want to chat about photography, feel free to reach out.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 text-lg font-light"
                >
                    <a
                        href="/contact"
                        className="underline underline-offset-4 decoration-muted-foreground hover:text-foreground"
                    >
                        Get in Touch
                    </a>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default About;