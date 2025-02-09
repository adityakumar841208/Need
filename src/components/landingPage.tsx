'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

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
                            <Button variant="outline" className="p-6 text-xl">
                                Learn More
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
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold inline-block relative pb-4">
                            Why Choose Us
                            <span
                                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-slate-500`}
                            ></span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="p-6 rounded-xl hover:shadow-lg transition-shadow shadow-md cursor-pointer"
                            >
                                <h3 className="text-xl font-semibold mb-2 hover:underline">{feature.title}</h3>
                                <p className="">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

const features = [
    {
        title: 'Instant Connections',
        description: 'Find the right service provider in seconds and get the job done.',
    },
    {
        title: 'Secure Communication',
        description: 'At Need, your privacy and security are our top priority.',
    },
    {
        title: 'Find Nearby Services',
        description: 'Discover services and opportunities near you with ease.',
    },
];
