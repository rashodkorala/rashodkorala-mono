"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import type { AlbumSummary } from "@/app/actions/albums";

interface AlbumsProps {
  albums: AlbumSummary[];
}

function formatDateRange(dateFrom: string | null, dateTo: string | null): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (dateFrom && dateTo) return `${fmt(dateFrom)} – ${fmt(dateTo)}`;
  if (dateFrom) return fmt(dateFrom);
  if (dateTo) return fmt(dateTo);
  return "";
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Albums = ({ albums }: AlbumsProps) => {
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
        <div className="flex justify-between items-center w-full mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.45em] text-muted-foreground"
          >
            Albums
          </motion.p>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-light mb-4"
        >
          Stories in sequences.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-12"
        >
          Curated collections from trips, projects, and moments worth holding onto.
        </motion.p>

        {albums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center text-muted-foreground"
          >
            <p className="text-sm uppercase tracking-[0.35em]">No albums yet</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {albums.map((album) => {
              const dateRange = formatDateRange(album.dateFrom, album.dateTo);
              return (
                <motion.div key={album.id} variants={itemVariants} whileHover={{ y: -4 }}>
                  <Link href={`/albums/${album.slug}`} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden bg-muted mb-4">
                      {album.coverUrl ? (
                        <Image
                          src={album.coverUrl}
                          alt={album.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                            No Cover
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-3 right-3">
                        <span className="text-xs uppercase tracking-[0.25em] text-white/80 bg-black/40 px-2 py-0.5">
                          {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-light tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
                        {album.title}
                      </h2>
                      {album.location && (
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {album.location}
                        </p>
                      )}
                      {dateRange && (
                        <p className="text-xs text-muted-foreground">{dateRange}</p>
                      )}
                      {album.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">
                          {album.description}
                        </p>
                      )}
                      {album.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {album.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Albums;
