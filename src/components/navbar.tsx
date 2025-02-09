'use client';

import React, { useState, useEffect } from 'react';
import ModeToggle from './ui/mode-toggle';
import { Button } from './ui/button';
import Link from 'next/link';

export default function Navbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowNavbar(false); // Scrolling down, hide navbar
            } else {
                setShowNavbar(true); // Scrolling up, show navbar
            }
            setLastScrollY(window.scrollY); // Update last scroll position
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <nav
            className={`w-full backdrop-blur-sm bg-background/60 z-50 border-b transition-transform duration-300 sticky top-0 left-0 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
                <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Need
                </div>

                <div className="items-center space-x-6 hidden md:flex">
                    <Link href="/About" className="text-base font-medium transition-colors hover:text-primary">
                        About
                    </Link>
                    <Link href='/login' className="text-base font-medium transition-colors hover:text-primary">
                        Login
                    </Link>
                    <Link href='/Register' className="text-base font-medium transition-colors hover:text-primary">
                        Register
                    </Link>
                    <Button>
                        Contact
                    </Button>
                    <ModeToggle />
                </div>

                <div className="items-center space-x-6 flex md:hidden">
                    <Link href="/About" className="text-base font-medium transition-colors hover:text-primary">
                        About
                    </Link>
                    <Link href='/login' className="text-base font-medium transition-colors hover:text-primary">
                        Login
                    </Link>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
