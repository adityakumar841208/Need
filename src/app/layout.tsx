'use client';
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider >
              {children}
            </SessionProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
