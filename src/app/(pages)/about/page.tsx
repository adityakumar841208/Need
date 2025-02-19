'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Target, Heart, Star, Clock, Globe, Award } from 'lucide-react';

export default function About() {
    // ... existing values array ...

    return (
        <div className="min-h-screen bg-gradient-to-b">
            {/* Hero Section with Background Pattern */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b">
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(180deg,transparent,white,white,transparent)]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Content Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-left"
                        >
                            <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4">
                                Established 2024
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                                Connecting People with Services
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">
                                At Need, we believe in the power of connections. Our platform bridges the gap between skilled professionals and those seeking their expertise. We're not just a service marketplace; we're a community built on trust, reliability, and excellence.
                            </p>
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Join as Provider
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors"
                                >
                                    Find Services
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Image Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative p-20 h-full hidden md:flex items-center"
                        >
                            <div className="w-full aspect-square relative">
                                {/* Main Image Container */}
                                <div className="rounded-3xl overflow-hidden h-full">
                                    <div className="h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
                                        <img
                                            src="/about-us.gif"
                                            alt="Need Platform"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Stats Overlay */}
                                <div className="absolute -right-4 bottom-12 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-xl">
                                    <div className="text-2xl font-bold text-blue-600">1000+</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Active Providers</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Story Section (New) */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Need was born from a simple observation: finding reliable service providers shouldn't be complicated.
                            What started as a small idea has grown into a thriving marketplace connecting thousands of skilled professionals with customers.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                            Today, we're proud to facilitate connections that help both service providers grow their businesses and customers find the exact help they need.
                            Our platform continues to evolve with new features and improvements based on our community's feedback.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                            <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-6">
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    {[Clock, Globe, Star, Award].map((Icon, index) => (
                                        <div key={index} className="flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl">
                                            <Icon className="w-12 h-12 text-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div> */}

            {/* Mission Section (Updated) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-3xl mx-auto mb-8">
                            To create a seamless platform that connects skilled professionals with those seeking their services,
                            while ensuring trust, safety, and excellence in every interaction.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {['Connect', 'Protect', 'Grow'].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{item}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section (Updated) */}
            {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto">
                            Every day, we help thousands of people connect and get things done. Here's what we've achieved so far.
                        </p>
                    </div>
                </div>
            </div> */}

            {/* Team Section (New) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Passionate individuals working together to make service connections easier and more reliable.
                    </p>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4"></div>
                            <h3 className="font-bold mb-1">Team Member {index + 1}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Position</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}