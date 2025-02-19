'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        // Add your form submission logic here
        console.log(values);
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: 'info@need.com',
            description: 'We\'ll respond within 24 hours',
            action: {
                type: 'email',
                value: 'info@need.com'
            }
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: '+91 6204542197',
            description: 'Mon-Fri from 8am to 5pm',
            action: {
                type: 'tel',
                value: '6204542197'
            }
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: 'Saran, Chhapra',
            description: 'Bihar, India'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: 'Monday - Friday',
            description: '9:00 AM - 6:00 PM'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b ">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(180deg,transparent,white,white,transparent)]" />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-600 dark:text-slate-400"
                        >
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">{item.title}</h3>
                                        <div className="flex items-center gap-2">
                                            {item.action ? (
                                                <a
                                                    href={`${item.action.type}:${item.action.value}`}
                                                    className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
                                                >
                                                    {item.details}
                                                </a>
                                            ) : (
                                                <p className="text-blue-500 dark:text-blue-400 font-medium">
                                                    {item.details}
                                                </p>
                                            )}
                                            {(item.action?.type === 'email' || item.action?.type === 'tel') && (
                                                <button
                                                    onClick={() => handleCopy(item.details)}
                                                    className="p-1 hover:bg-blue-500/10 rounded-full transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="w-4 h-4 text-blue-500" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Your message here..."
                                                        className="min-h-[250px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}