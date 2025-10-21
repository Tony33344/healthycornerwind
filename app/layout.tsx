import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Healthy Corner - Alpski Zdraviliški Kamp",
  description: "Health and wellness retreat in Camp Menina focusing on healthy food, yoga, Wim Hof method, and ice baths.",
  keywords: ["wellness", "yoga", "healthy food", "Wim Hof", "ice bath", "retreat", "Slovenia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
