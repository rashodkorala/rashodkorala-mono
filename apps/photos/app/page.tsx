"use client";

import Main from "@/components/Pages/Home";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [isCheckingIntro, setIsCheckingIntro] = useState(true);
    const [shouldShowHome, setShouldShowHome] = useState(false);

    useEffect(() => {
        const hasSeenAnimation = sessionStorage.getItem('hasSeenOpeningAnimation') === 'true';

        if (!hasSeenAnimation) {
            router.replace('/intro');
            return;
        }

        setShouldShowHome(true);
        setIsCheckingIntro(false);
    }, [router]);

    if (isCheckingIntro) {
        return null;
    }

    if (!shouldShowHome) {
        return null;
    }

    return <Main />;
}
