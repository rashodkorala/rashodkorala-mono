import { useEffect } from "react";
import Link from "next/link";

const NotFound = () => {


    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            window.location.pathname
        );
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-light tracking-tight">404</h1>
                <p className="text-lg text-muted-foreground">Page not found</p>
                <Link href="/" className="inline-block text-xs uppercase tracking-[0.35em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 py-2">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;