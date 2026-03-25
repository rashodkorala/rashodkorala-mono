'use client';
import { ModeToggle } from "@/lib/theme_switcher";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <div className="z-50">
            {/* Menu Buttons */}
            <button
                className="text-6xl md:text-7xl font-medium focus:outline-none hidden text-black dark:text-white lg:block"
                onClick={() => setIsOpen(!isOpen)}
            >
                + Menu
            </button>
            <button
                className="text-6xl md:text-7xl font-medium focus:outline-none text-black dark:text-white block lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                +
            </button>

            {/* Sidebar */}
            {isOpen && (
                <div className="fixed top-0 right-0 w-full lg:w-1/3 h-full bg-background text-foreground shadow-lg p-6 z-10">
                    <button
                        className="text-6xl md:text-7xl font-medium mb-4 focus:outline-none absolute top-4 right-4"
                        onClick={closeMenu}
                    >
                        ✕
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-11 w-full h-full justify-center font-thin px-6 md:px-10">
                        <div className="flex flex-col space-y-4 text-4xl sm:text-5xl md:text-6xl">
                            <Link
                                href="/work"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                Work
                            </Link>
                            <Link
                                href="/view"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                The View
                            </Link>
                            <Link
                                href="/about"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                About
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-col space-y-4 text-3xl md:text-4xl">
                            <Link
                                href="https://instagram.com/rashodk_"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                Instagram
                            </Link>
                            <Link
                                href="https://linkedin.com/in/rashodk"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                LinkedIn
                            </Link>
                            <Link
                                href="https://github.com/rashodkorala"
                                className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={closeMenu}
                            >
                                GitHub
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}
