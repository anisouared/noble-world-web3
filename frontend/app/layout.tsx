import CustomRainbowKitProvider from "./CustomRainbowKitProvider"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/shared/Header";
import { Inter, Montserrat } from 'next/font/google'
import Layout from "@/components/shared/Layout";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Noble World",
  description: "Pride in conscious luxury ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />

        <CustomRainbowKitProvider>
          <Layout>
            <div className="min-h-screen bg-no-repeat bg-right-top" style={{ backgroundImage: "url('/images/hero-shape-2.svg')" }}>
              <div className="min-h-screen bg-no-repeat bg-left-top" style={{ backgroundImage: "url('/images/hero-shape-1.svg')" }}>
                <div className="min-h-screen bg-no-repeat bg-left-bottom" style={{ backgroundImage: "url('/images/hero-shape-3.svg')" }}>
                  <div className="min-h-screen bg-no-repeat bg-right-bottom" style={{ backgroundImage: "url('/images/hero-shape-4.svg')" }}>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </CustomRainbowKitProvider>
      </body>
    </html>
  );
}
