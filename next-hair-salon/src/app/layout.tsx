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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='mytheme'>
      <head>
        <title>HairCut</title>
        <meta name='description' content='hairSaloon!"' />
        <link rel='icon' href='/favicon.ico' />
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased my-gradient",
          fontSans.variable
        )}
      >
        <Header></Header>
        <main className='mx-auto min-h-screen'>{children}</main>
        <Footer></Footer>
      </body>
    </html>
  );
}
