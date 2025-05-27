'use client';

import React, { useState, useEffect } from 'react';
import ModeToggle from '@/components/ui/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, User, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DashboardNavbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`w-full backdrop-blur-sm bg-background/60 z-50 border-b transition-transform duration-300 sticky top-0 left-0 
            ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
                {/* Desktop Navbar */}
                <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Needify
                </div>
                <div className="flex items-center space-x-6">
                    <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={''} />
                                <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log('signOut()')}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden flex justify-between items-center px-6 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <div className="px-4 py-2 text-lg font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Need</div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="/dashboard/services">Services</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => console.log('signOut()')}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
