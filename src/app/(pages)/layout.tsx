'use client'

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import '@/app/globals.css'


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                {children}
            </div>
            <Footer />

        </>
    );
}