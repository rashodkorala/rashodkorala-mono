"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAlbums } from "@/app/actions/albums";
import type { AlbumSummary } from "@/app/actions/albums";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FeaturedAlbums = () => {
  const [albums, setAlbums] = useState<AlbumSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAlbums().then((data) => {
      setAlbums(data.filter((a) => a.featured).slice(0, 3));
      setLoaded(true);
    });
  }, []);

  if (!loaded || albums.length === 0) return null;

  return (
    <motion.section
      id="albums"
      className="px-6 md:px-12 lg:px-16 py-16 border-b border-border"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
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
          Albums
        </p>
        <Link
          href="/albums"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
        >
          View all →
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {albums.map((album: AlbumSummary) => (
          <motion.div key={album.id} variants={itemVariants} whileHover={{ y: -4 }}>
            <Link href={`/albums/${album.slug}`} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted mb-3">
                {album.coverUrl ? (
                  <Image
                    src={album.coverUrl}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 bg-black/40 px-2 py-0.5">
                    {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-light tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
                {album.title}
              </h3>
              {album.location && (
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
                  {album.location}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default FeaturedAlbums;
