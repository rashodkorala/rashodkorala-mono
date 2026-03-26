"use client";

import { motion } from "framer-motion";
import { Code, Coffee, Globe, Camera } from "lucide-react";

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
    <div className="max-w-3xl py-12 md:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl tracking-tight mb-12"
      >
        About
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="max-w-2xl mb-16"
      >
        <div className="space-y-5 text-[15px] text-muted_ink font-light leading-[1.8]">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-[11px] tracking-[0.15em] uppercase text-ink/30 mb-8">
          Technical Skills
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {skills.map((skill) => (
            <div key={skill.category}>
              <h3 className="text-lg font-light mb-3">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map(item => (
                  <span
                    key={item}
                    className="px-3 py-1.5 border border-ink/10 rounded-full text-[13px] text-ink/50 hover:bg-ink hover:text-cream transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-[11px] tracking-[0.15em] uppercase text-ink/30 mb-8">
          Beyond Code
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {interests.map((interest) => (
            <div
              key={interest.title}
              className="p-5 border border-ink/8 rounded-lg hover:border-ink/15 transition-colors"
            >
              <interest.icon className="w-5 h-5 text-ink/30 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-light mb-1">{interest.title}</h3>
              <p className="text-[13px] text-ink/40 font-light">{interest.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="border-t border-ink/10 pt-12 text-center"
      >
        <p className="text-sm text-ink/40 font-light mb-5">
          Interested in working together?
        </p>
        <a
          href="mailto:hello@rashodkorala.com"
          className="inline-flex items-center gap-2 px-6 py-3 border border-ink/15 rounded-full text-sm hover:bg-ink hover:text-cream transition-colors"
        >
          Get in touch
        </a>
      </motion.div>
    </div>
  );
}
