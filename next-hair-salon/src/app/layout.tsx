import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { cn } from "../lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "HairCut",
  description: "Hair Salon",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="mytheme">
      <body
        className={cn(
          fontSans.variable,
          "min-h-screen bg-background font-sans antialiased my-gradient"
        )}
      >
        <Header />
        <main className="mx-auto min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
