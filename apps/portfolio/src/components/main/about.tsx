"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Code, Coffee, Globe, Camera } from "lucide-react";
import Link from "next/link";

const skills = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Go", "Swift"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "GraphQL"] },
  { category: "Cloud", items: ["AWS", "Kubernetes", "Docker", "CI/CD"] }
];

const interests = [
  { icon: Code, title: "Open Source", description: "Contributing to projects that make developers' lives easier" },
  { icon: Coffee, title: "Coffee Culture", description: "Exploring specialty coffee shops and brewing methods" },
  { icon: Globe, title: "Travel", description: "Working remotely from different cities around the world" },
  { icon: Camera, title: "Photography", description: "Documenting life through a minimalist lens" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-8"
      >
        <div className="max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="text-sm font-light">Back to home</span>
          </Link>
        </div>
      </motion.div>

      <div className="px-6 md:px-12 pb-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-20"
          >
            <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
              About
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mb-24"
          >
            <div className="space-y-6 text-[17px] text-white/50 font-light leading-[1.8]">
              <p>
                Five years of building web and mobile applications. A journey that started with curiosity about how things work, naturally leading to a deep connection with code and craft.
              </p>
              <p>
                Specializing in creating elegant, performant applications across the full stack. The belief is simple: the best software is invisible, working seamlessly, integrating into lives without friction.
              </p>
              <p>
                Beyond coding, time is spent building a startup, mentoring junior developers, and exploring new cities with a camera. Open source isn&apos;t just a practice but a way of giving back to the community that made growth possible.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-24"
          >
            <h2 className="text-sm tracking-[0.08em] uppercase text-white/30 mb-8">
              Technical Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                >
                  <h3 className="text-xl font-light mb-4">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <span
                        key={item}
                        className="px-3 py-1.5 border border-white/10 rounded-full text-[13px] text-white/50 hover:bg-white hover:text-black transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-24"
          >
            <h2 className="text-sm tracking-[0.08em] uppercase text-white/30 mb-8">
              Beyond Code
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {interests.map((interest, i) => (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  className="p-6 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  <interest.icon className="w-6 h-6 text-white/30 mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-light mb-2">{interest.title}</h3>
                  <p className="text-sm text-white/40 font-light">{interest.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="border-t border-white/10 pt-16 text-center"
          >
            <p className="text-lg text-white/40 font-light mb-6">
              Interested in working together?
            </p>
            <a
              href="mailto:hello@rashodkorala.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 rounded-full text-sm hover:bg-white hover:text-black transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
