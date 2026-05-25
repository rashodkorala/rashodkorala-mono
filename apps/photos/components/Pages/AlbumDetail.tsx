"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import type { AlbumDetail } from "@/app/actions/albums";

interface AlbumDetailProps {
  album: AlbumDetail;
}

function formatDateRange(dateFrom: string | null, dateTo: string | null): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
      return fmt(dateFrom);
    }
    return `${fmt(dateFrom)} – ${fmt(dateTo)}`;
  }
  if (dateFrom) return fmt(dateFrom);
  if (dateTo) return fmt(dateTo);
  return "";
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const AlbumDetailPage = ({ album }: AlbumDetailProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof album.photos)[0] | null>(null);
  const dateRange = formatDateRange(album.dateFrom, album.dateTo);

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero section */}
      <motion.section
        className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 border-b border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center w-full mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/albums"
              className="text-xs uppercase tracking-[0.35em] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Albums
            </Link>
          </motion.div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {(album.location || dateRange) && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
            >
              {[album.location, dateRange].filter(Boolean).join(" · ")}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-light"
          >
            {album.title}
          </motion.h1>
          {album.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-1"
            >
              {album.tags.map((tag) => (
                <span key={tag} className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {album.coverUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[21/9] overflow-hidden"
          >
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        )}
      </motion.section>

      {/* Description / narrative */}
      {album.description && (
        <motion.section
          className="px-4 sm:px-6 md:px-12 lg:px-16 py-10 sm:py-14 border-b border-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl space-y-5">
            {album.description.split(/\n\n+/).map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </motion.section>
      )}

      {/* Photo grid */}
      <motion.section
        className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16"
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
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Photos
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {album.photoCount} {album.photoCount === 1 ? "frame" : "frames"}
            </p>
          </div>
        </motion.div>

        {album.photos.length === 0 ? (
          <p className="text-sm text-muted-foreground uppercase tracking-[0.35em]">
            No photos in this album yet.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {album.photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-[3/4] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.altText || photo.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                {photo.caption && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Photo modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className="max-w-full max-h-full object-contain"
                width={1000}
                height={1000}
              />
              {(selectedPhoto.title || selectedPhoto.caption) && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4"
                >
                  <h3 className="text-lg font-light">{selectedPhoto.title}</h3>
                  {selectedPhoto.caption && (
                    <p className="mt-1 text-sm text-gray-300">{selectedPhoto.caption}</p>
                  )}
                </motion.div>
              )}
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-white text-3xl hover:text-gray-300 transition-colors"
                onClick={() => setSelectedPhoto(null)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumDetailPage;
