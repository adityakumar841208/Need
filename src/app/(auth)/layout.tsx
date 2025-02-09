'use client';

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import '@/app/globals.css';


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
                <Footer />
            </ThemeProvider>
        </>
    )
}