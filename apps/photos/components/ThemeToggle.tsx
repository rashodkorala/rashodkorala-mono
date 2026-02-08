"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    const handleToggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <Button variant="ghost" size="lg" onClick={handleToggle} className="text-xs uppercase tracking-[0.35em]">
            {isDark ? `Light` : `Dark`}
        </Button>

    );
};

export default ThemeToggle;

