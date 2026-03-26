"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/rashodkorala" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
  { icon: Twitter, label: "Twitter", href: "#" }
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer id="footer" ref={ref} className="bg-black text-white py-24 px-6 md:px-12 lg:ml-56">
      <div className="max-w-4xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-white/30 mb-4">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              Let&apos;s work <span className="font-medium">together</span>
            </h2>
            <p className="text-white/40 font-light mb-8 leading-relaxed">
              Have a project in mind or want to discuss opportunities?
              I&apos;m always open to interesting conversations.
            </p>

            <motion.a
              href="mailto:hello@rashodkorala.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 text-xl md:text-2xl font-light hover:text-white/60 transition-colors group"
            >
              <Mail className="w-5 h-5" strokeWidth={1} />
              hello@rashodkorala.com
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:text-right"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-white/30 mb-6">
              Connect
            </p>

            <div className="flex md:justify-end gap-4 mb-16">
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>

            <div className="space-y-2 text-white/30 text-sm font-light">
              <p>Based in St. John&apos;s, Newfoundland</p>
              <p>Available for remote work worldwide</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-white/20 font-light">
            © {new Date().getFullYear()} — Designed & Built with care
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
