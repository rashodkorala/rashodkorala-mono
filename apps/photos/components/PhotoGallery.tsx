import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getPhotos, type Photo, type Category } from "@/app/actions/photos";
import { motion, AnimatePresence } from "framer-motion";


const categories = [
    'all',
    'architecture',
    'nature',
    'street',
    'travel',
    'wildlife',
    'night',
    'abstract',
    'interior_spaces'
] as const;

const formatCategoryLabel = (category: Category) =>
    category === 'interior_spaces'
        ? 'Interior Spaces'
        : category.charAt(0).toUpperCase() + category.slice(1);

interface PhotoGalleryProps {
    showFilters?: boolean;
    filterStyle?: "pills" | "dropdown";
}
const PhotoGallery = ({
    showFilters = true,
    filterStyle = "pills",
}: PhotoGalleryProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');

    // Shuffle function
    const shuffleArray = (array: Photo[]): Photo[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setIsLoading(true);
                const data = await getPhotos(selectedCategory);

                if (selectedCategory === 'all') {
                    setPhotos(shuffleArray(data));
                } else {
                    setPhotos(data);
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhotos();
    }, [selectedCategory]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8" id="gallery">

            {/* Category Filter */}
            {showFilters && (
                <>
                    {filterStyle === "dropdown" ? (
                        <div className="flex justify-end w-full">
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                                <span>Filter</span>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => setSelectedCategory(value as Category)}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {formatCategoryLabel(category)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-3 flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 transition-colors border ${selectedCategory === category
                                        ? 'bg-foreground text-background border-foreground'
                                        : 'bg-transparent text-muted-foreground border-border hover:text-foreground'
                                        }`}
                                >
                                    {formatCategoryLabel(category)}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Photo Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
            >
                {photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: 20 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {
                                    duration: 0.5,
                                    ease: "easeOut",
                                },
                            },
                        }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="cursor-pointer group"
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <div className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4]">
                            <Image
                                src={photo.image_url}
                                alt={photo.alt_text || photo.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Photo Modal */}
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
                                src={selectedPhoto.image_url}
                                alt={selectedPhoto.alt_text || selectedPhoto.title}
                                className="max-w-full max-h-full object-contain"
                                width={1000}
                                height={1000}
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4"
                            >
                                <h3 className="text-xl font-semibold">{selectedPhoto.title}</h3>
                                {selectedPhoto.description && (
                                    <p className="mt-2">{selectedPhoto.description}</p>
                                )}
                                <p className="mt-2 text-sm text-gray-300">
                                    Category: {selectedPhoto.category}
                                </p>
                            </motion.div>
                            <button
                                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
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

export default PhotoGallery;
