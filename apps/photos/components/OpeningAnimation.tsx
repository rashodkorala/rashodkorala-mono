"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const OpeningAnimation = () => {
    const router = useRouter();
    const [animationStage, setAnimationStage] = useState<'first' | 'second' | 'third' | 'complete'>('first');

    useEffect(() => {
        const firstTimer = setTimeout(() => setAnimationStage('second'), 2000);
        const secondTimer = setTimeout(() => setAnimationStage('third'), 4500);
        const thirdTimer = setTimeout(() => setAnimationStage('complete'), 7500);
        const navigateTimer = setTimeout(() => {
            sessionStorage.setItem('hasSeenOpeningAnimation', 'true');
            router.push('/');
        }, 8500);

        return () => {
            clearTimeout(firstTimer);
            clearTimeout(secondTimer);
            clearTimeout(thirdTimer);
            clearTimeout(navigateTimer);
        };
    }, [router]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
            <div className="relative font-light">
                <AnimatePresence mode="wait">

                    {/* Stage 1 */}
                    {animationStage === 'first' && (
                        <motion.div
                            key="first"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-center"
                        >
                            <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight font-extralight">
                                Photos
                            </h1>
                            <p className="text-[clamp(1rem,2vw,1.5rem)] text-muted-foreground mt-4 tracking-wide font-light">
                                by Rashod Korala
                            </p>
                        </motion.div>
                    )}

                    {/* Stage 2 */}
                    {animationStage === 'second' && (
                        <motion.div
                            key="second"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-center max-w-3xl px-6"
                        >
                            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-tight leading-[1.2]">
                                The world, as I see it.
                            </h1>
                        </motion.div>
                    )}

                    {/* Stage 3 */}
                    {animationStage === 'third' && (
                        <motion.div
                            key="third"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-center max-w-3xl px-6"
                        >
                            <p className="text-[clamp(1.125rem,2vw,1.35rem)] text-muted-foreground leading-relaxed font-light">
                                Where light meets memory, and fleeting atmospheres become something to hold.
                                Each frame captures not just what was seen, but how it felt to be there,
                                in that particular light, at that particular moment.
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default OpeningAnimation;