import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { InitialLoginDialog } from "@/components/auth/InitialLoginDialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Murphy Al-Saham",
  description:
    "Revolutionizing furniture design through artificial intelligence",
  icons: {
    icon: "/images/logo-large.jpg",
    shortcut: "/images/logo-large.jpg",
    apple: "/images/logo-large.jpg", // Path to the apple touch ico // Assuming this is intended as favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-20">{children}</main>
        <InitialLoginDialog />
        <Toaster />
      </body>
    </html>
  );
}
