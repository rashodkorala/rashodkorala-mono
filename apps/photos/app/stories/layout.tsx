import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-story-display",
    display: "swap",
});

export default function StoriesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`${fraunces.variable} relative min-h-screen border-b border-border`}
        >
            {children}
        </div>
    );
}
