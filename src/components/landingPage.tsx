'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    CheckCircle,
    Shield,
    Home,
    Briefcase,
    Sparkles,
    Lock,
    CreditCard
} from 'lucide-react';


export default function LandingPage() {

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-0 md:py-10">
                <div className="grid lg:grid-cols-2 sm:gap-4 md:gap-12 items-center">
                    <div className='md:hidden sm:block'>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className='mx-auto'
                        >
                            <img
                                src="/need.png"
                                alt="Hero"
                                className="w-[80%] h-auto rounded-2xl mx-auto"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <h1 className="text-3xl md:text-6xl font-bold leading-tight">
                            Seamless Solutions for Every Need
                        </h1>
                        <p className="text-lg md:text-xl">
                            A platform that simplifies the way people connect with services and opportunities. Whether you're looking for help or offering your skills, we provide an easy and efficient way to meet your needs and drive growth.
                        </p>
                        <div className="flex gap-6">
                            <Button className="p-6 text-xl">
                                Get Started
                            </Button>
                        </div>
                    </motion.div>
                    <div className='hidden md:block'>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src="/need.png"
                                alt="Hero"
                                className="w-full h-auto rounded-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-b">
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(180deg,transparent,white,white,transparent)]" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-primary font-semibold text-sm mb-4"
                        >
                            Why Choose Us
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold"
                        >
                            Features that{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                set us apart
                            </span>
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ translateY: -8 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                                <div className="relative z-10 bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300">
                                    {/* Icon Container */}
                                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-r ${feature.color}`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-slate-800">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Effect Decoration */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-3xl opacity-0 group-hover:opacity-10 blur transition duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Your Journey With Us
                        </motion.h2>
                        <p className="text-xl text-gray-400">Choose your path and get started</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
                        {/* Service Provider Journey */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 rounded-2xl p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Service Provider</h3>
                                <p className="text-gray-400">Start providing your services</p>
                            </div>

                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-500/20 -z-10"></div>

                                {/* Steps */}
                                {serviceProviderSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="flex gap-6 mb-8 relative"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-slate-800">
                                            <step.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                                            <p className="text-gray-400">{step.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Customer Journey */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 rounded-2xl p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Customer</h3>
                                <p className="text-gray-400">Find the perfect service provider</p>
                            </div>

                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/20 -z-10"></div>

                                {/* Steps */}
                                {customerSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="flex gap-6 mb-8 relative"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border-4 border-slate-800">
                                            <step.icon className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                                            <p className="text-gray-400">{step.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Popular Categories */}
            <div className="py-20 ">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Explore Categories
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative overflow-hidden rounded-2xl aspect-square"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                                <img
                                    src={`/${category.img}`}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                                    <div className="text-3xl mb-2">{category.icon}</div>
                                    <h3 className="text-xl font-bold">{category.name}</h3>
                                    <p className="text-sm text-gray-200">{category.count}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold inline-block relative pb-4">
                            Frequently Asked Questions
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-slate-500"></span>
                        </h2>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="mb-6"
                            >
                                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                                <p className="dark:text-gray-400 text-gray-700">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trust & Safety Section */}
            {/* <div className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4"
                        >
                            Your Security Is Our Priority
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Trust & Safety
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
                        >
                            We've implemented multiple layers of security to ensure your peace of mind
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {trustFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ translateY: -8 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500/50 dark:hover:border-blue-500/50">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                                            <feature.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                        Learn more
                                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div> */}

        </div>
    );
}

const features = [
    {
        title: 'Instant Connections',
        description: 'Find the right service provider in seconds and get the job done.',
        icon: Sparkles,
        color: 'from-blue-500 to-cyan-400'
    },
    {
        title: 'Secure Communication',
        description: 'At Need, your privacy and security are our top priority.',
        icon: Shield,
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'Find Nearby Services',
        description: 'Discover services and opportunities near you with ease.',
        icon: Search,
        color: 'from-green-500 to-emerald-400'
    },
];

// First, update the steps constant with separate workflows
const serviceProviderSteps = [
    {
        title: "Register as Provider",
        description: "Create your professional account in minutes",
        icon: Users
    },
    {
        title: "Complete Profile",
        description: "Add your services, experience, and verification documents",
        icon: Briefcase
    },
    {
        title: "Get Verified",
        description: "Our team verifies your credentials for trust and safety",
        icon: Shield
    },
    {
        title: "Start Providing",
        description: "Post your services and connect with customers",
        icon: Sparkles
    }
];

const customerSteps = [
    {
        title: "Quick Registration",
        description: "Sign up as a customer in just a few clicks",
        icon: Users
    },
    {
        title: "Find Services",
        description: "Search for nearby service providers or post your needs",
        icon: Search
    },
    {
        title: "Choose & Connect",
        description: "Select from verified providers and communicate directly",
        icon: CheckCircle
    },
    {
        title: "Get Service",
        description: "Receive quality service and share your experience",
        icon: Home
    }
];

// Replace the existing How It Works section with this new design

const categories = [
    {
        name: "Home Services",
        count: "1.2k+ providers",
        icon: "🏠",
        img: "category-homeservice.webp"
    },
    {
        name: "Professional Services",
        count: "800+ providers",
        icon: "💼",
        img: "category-professionalservice.webp"
    },
    {
        name: "Personal Care",
        count: "600+ providers",
        icon: "✨",
        img: "category-personalcare.webp"
    },
    {
        name: "Education",
        count: "900+ providers",
        icon: "📚",
        img: "category-education.webp"
    }
];

const faqs = [
    {
        question: "How does Need work?",
        answer: "Need connects you with local service providers through a simple, secure platform. Just create a profile, search for services, and connect with verified providers."
    },
    {
        question: "Is Need safe to use?",
        answer: "Yes, Need prioritizes your safety. All service providers undergo verification, and privacy protection measures."
    },
    {
        question: "How do I get started?",
        answer: "Simply click the 'Get Started' button, create your account, and you can immediately start browsing or listing services."
    }
];

const trustFeatures = [
    {
        title: "Verified Providers",
        description: "Every service provider undergoes a thorough verification process including background checks, document verification, and skill assessment.",
        icon: Shield
    },
    {
        title: "Secure Platform",
        description: "Your data is protected with bank-level security. We use end-to-end encryption for all communications and transactions.",
        icon: Lock
    },
    {
        title: "Safe Payments",
        description: "All payments are processed through secure payment gateways with fraud protection and buyer-seller protection policies.",
        icon: CreditCard
    }
];