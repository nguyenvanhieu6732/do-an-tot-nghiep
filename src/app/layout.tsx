"use client";

import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import "./globals.css";
import Loading from "./(routes)/loading";
import { ReactNode } from "react";
import { Toaster } from 'sonner'


// Component con để xử lý logic đồng bộ user

function UserSync({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      fetch("/api/sync-users")
        .then((res) => {
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          return res.json();
        })
        .then((data) => console.log("Sync success:", data))
        .catch((error) => console.error("Sync failed:", error));
    }
  }, [isLoaded, user]);

  return children; // Render children mà không thêm UI thừa
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ClerkProvider>
      <html lang="vi">
        <head>
          <title>LUXMEN - thời trang nam</title>
        </head>
        <body className={`${geistSans.variable} bg-background text-foreground`}>
          {mounted ? (
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <UserSync>
                <Header />
                <main>
                  <Toaster />
                  {children}
                </main>
                <Footer />
              </UserSync>
            </ThemeProvider>
          ) : (
            <Loading />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}