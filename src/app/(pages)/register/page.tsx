'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { FcGoogle } from 'react-icons/fc'
import { z } from 'zod'
import { useRouter } from 'next/navigation'



export default function LoginPage() {
    const [isServiceProvider, setIsServiceProvider] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({ 'email': '', 'password': '' })
    const router = useRouter()

    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    })

    // function to handle form submission
    const handleSubmit = async (e: FormEvent) => {
        // console.log('Form submitted')

        e.preventDefault();
        setIsLoading(true);
        setError({ email: "", password: "" });
        try {

            // Validate form data
            const loginData = loginSchema.parse({ email, password });
            console.log('Login data:', loginData)


            const endpoint = isServiceProvider ? "/api/auth/service-provider/register" : "/api/auth/customer/register";
            console.log('Endpoint:', endpoint)
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ credentials: { email, password }, type: isServiceProvider ? "service-provider" : "customer" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Handle response
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            
            router.push("/home");

            console.log("Register Successful", data);
        } catch (error: any) {
            if (error.errors) {
                // Handle Zod validation errors
                setError({
                    email: error.errors?.find((err: any) => err.path?.includes("email"))?.message || "",
                    password: error.errors?.find((err: any) => err.path?.includes("password"))?.message || "",
                }); 
            } else {
                console.log("An error occurred during login:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 mx-auto rounded-2xl overflow-hidden bg-zinc-900">
                {/* left section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative hidden h-full min-h-[600px] flex-col p-10 text-white lg:flex"
                >
                    <div className="absolute inset-0" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <img src="/login.webp" alt="Logo" className="h-full
                         w-auto" />
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-xl font-medium leading-relaxed">
                                &ldquo;This platform has revolutionized how we connect with {isServiceProvider ? 'customers' : 'service providers'}.&rdquo;
                            </p>
                            <footer className="text-sm font-semibold mt-4">Aditya</footer>
                        </blockquote>
                    </div>
                </motion.div>

                {/* right section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:p-4 sm:p-8 flex items-center justify-center rounded-2xl md:rounded-r-2xl"
                >
                    <div className="w-full max-w-md space-y-2">
                        <Card className="shadow-md">
                            <CardHeader className="space-y-4">
                                <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
                                <div className="w-full rounded-lg border p-1">
                                    <div className="relative flex items-center">
                                        <motion.div
                                            className="absolute h-full rounded-md bg-primary"
                                            initial={{ x: isServiceProvider ? "100%" : "0%" }}
                                            animate={{ x: isServiceProvider ? "100%" : "0%" }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            style={{ width: "50%" }}
                                        />
                                        <button
                                            onClick={() => setIsServiceProvider(false)}
                                            className={`relative z-10 flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${!isServiceProvider ? 'text-white dark:text-black' : 'text-foreground'}`}
                                        >
                                            Customer
                                        </button>
                                        <button
                                            onClick={() => setIsServiceProvider(true)}
                                            className={`relative z-10 flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${isServiceProvider ? 'text-white dark:text-black' : 'text-foreground'}`}
                                        >
                                            Service Provider
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            className="h-11"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            className="h-11"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                                    </div>

                                    <Button disabled={isLoading} className="w-full h-11">
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Register
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <div className="relative w-full">
                                    <div className="flex items-center">
                                        <div className="flex w-full items-center justify-between px-2">
                                            <hr className="border-t border-gray-500/30 w-full" />
                                            <span className="px-6 text-gray-500 text-sm">OR</span>
                                            <hr className="border-t border-gray-500/30 w-full" />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" disabled={isLoading} className="w-full h-11">
                                    <FcGoogle className="mr-2 h-5 w-5" />
                                    Continue with Google
                                </Button>
                                <p className="text-center text-sm text-muted-foreground">
                                    Already Have an Account?{" "}
                                    <a
                                        href="/login"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Log In
                                    </a>
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}