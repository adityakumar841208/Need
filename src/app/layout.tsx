'use client';
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from "react-redux";
import { store } from "../store";
import { SocketProvider } from "@/contexts/SocketContext";

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
            <SocketProvider>
              <Provider store={store}>
                {children}
              </Provider>
            </SocketProvider>
          </ThemeProvider>

        </body>
      </html>
    </>
  )
}
