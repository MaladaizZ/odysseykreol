import type { Metadata } from "next";
import { Manrope, Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Navbar  from "@/components/layout/navabar"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odyssey Kreol",
  description: "Une vision contemporaine de la Guadeloupe",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${sourceSans3.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
        
        <Navbar/>
        {children}
        
        </body>
    </html>
  );
}
