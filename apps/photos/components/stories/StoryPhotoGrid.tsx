"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/app/actions/photos";
import { motion, AnimatePresence } from "framer-motion";

interface StoryPhotoGridProps {
    photos: Photo[];
}

export default function StoryPhotoGrid({ photos }: StoryPhotoGridProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    if (photos.length === 0) {
        return (
            <p className="px-6 py-16 text-center text-muted-foreground md:px-12 lg:px-16">
                No photos in this story yet.
            </p>
        );
    }

    return (
        <div className="space-y-8 px-6 pb-20 md:px-12 lg:px-16">
            <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: { staggerChildren: 0.08 },
                    },
                }}
            >
                {photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.45, ease: "easeOut" },
                            },
                        }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <div className="relative aspect-[3/4] overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                            <Image
                                src={photo.image_url}
                                alt={photo.alt_text || photo.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="relative max-h-full max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedPhoto.image_url}
                                alt={selectedPhoto.alt_text || selectedPhoto.title}
                                className="max-h-[85vh] w-auto max-w-full object-contain"
                                width={1600}
                                height={1600}
                            />
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.12 }}
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
                            >
                                <h3
                                    className="text-xl font-light tracking-tight"
                                    style={{
                                        fontFamily: "var(--font-story-display), serif",
                                    }}
                                >
                                    {selectedPhoto.title}
                                </h3>
                                {selectedPhoto.description && (
                                    <p className="mt-2 max-w-2xl text-sm text-white/85">
                                        {selectedPhoto.description}
                                    </p>
                                )}
                                {selectedPhoto.category && (
                                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                                        {selectedPhoto.category}
                                    </p>
                                )}
                            </motion.div>
                            <button
                                type="button"
                                className="absolute right-4 top-4 text-3xl text-white transition hover:text-white/70"
                                onClick={() => setSelectedPhoto(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
