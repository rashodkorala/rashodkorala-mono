"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-border bg-background transition-colors duration-300"
        >
            <div className="px-6 md:px-12 lg:px-16 py-12 flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-light uppercase tracking-[0.6em]"
                    >
                        Photos
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.4em] text-muted-foreground"
                    >
                        <Link href="/#about" className="hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/#gallery" className="hover:text-foreground transition-colors">
                            Gallery
                        </Link>
                        <Link href="/#contact" className="hover:text-foreground transition-colors">
                            Contact
                        </Link>
                    </motion.div>
                    <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        href="mailto:rashodkorala2002@gmail.com"
                        className="text-xs uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Email
                    </motion.a>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
                >
                    Framing the world with intention.
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground"
                >
                    © {new Date().getFullYear()} Rashod Korala
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
