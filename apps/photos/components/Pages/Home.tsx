"use client";

import PhotoGallery from "@/components/PhotoGallery";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";

const Index = () => {
    useEffect(() => {
        // Handle hash scrolling
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, []);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <div className="bg-background text-foreground transition-colors duration-300 relative">
            <motion.section
                id="gallery"
                className="px-6 md:px-12 lg:px-16 py-16 border-b border-border"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-10"
                >
                    <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                        Gallery
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground uppercase tracking-[0.25em]">
                            Scroll to wander
                        </span>
                        <div className="hidden md:block"> <ThemeToggle /></div>
                    </div>
                </motion.div>
                <PhotoGallery showFilters filterStyle="dropdown" />
            </motion.section>

            <motion.section
                id="contact"
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
                    Contact
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-light max-w-3xl leading-tight"
                >
                    Commissions, collaborations, and quiet conversations.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
                >
                    Email me for bookings, print requests, or to talk about the work.
                    I respond within 48 hours.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 text-lg font-light"
                >
                    <a
                        href="mailto:rashodkorala2002@gmail.com"
                        className="underline underline-offset-4 decoration-muted-foreground hover:text-foreground"
                    >
                        rashodkorala2002@gmail.com
                    </a>
                    <p className="text-muted-foreground">Based in St. John&apos;s, working worldwide</p>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default Index;
