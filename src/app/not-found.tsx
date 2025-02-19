'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <div className="w-16 h-1 bg-blue-500 mx-auto mb-8"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        Sorry, we couldn't find the page you're looking for.
                    </p>
                    
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute w-96 h-96 blur-3xl rounded-full bg-blue-500/20 -top-48 -left-48"></div>
                <div className="absolute w-96 h-96 blur-3xl rounded-full bg-purple-500/20 -bottom-48 -right-48"></div>
            </div>
        </div>
    );
}