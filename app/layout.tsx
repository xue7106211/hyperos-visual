import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HyperOS 设计与开发平台全景图",
  description: "HyperOS 设计与开发平台分类全景",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#1b1e23]">{children}</body>
    </html>
  );
}
