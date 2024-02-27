import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='cupcake'>
      <head>
        <title>HairCut</title>
        <meta name='description' content='hairSaloon!"' />
        <link rel='icon' href='/favicon.ico' />
      </head>

      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
