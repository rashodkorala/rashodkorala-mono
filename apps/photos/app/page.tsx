"use client";

import Main from "@/components/Pages/Home";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Check if animation has been shown in this session
        if (typeof window !== 'undefined') {
            const hasSeenAnimation = sessionStorage.getItem('hasSeenOpeningAnimation') === 'true';
            
            // Redirect to intro page if animation hasn't been shown
            if (!hasSeenAnimation) {
                router.push('/intro');
            }
        }
    }, [router]);

    // Show home page content
    return <Main />;
}
