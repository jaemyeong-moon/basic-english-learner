import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { LearningProvider } from "@/lib/LearningContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "영어 구동사 학습",
  description: "한국인을 위한 영어 구동사(Phrasal Verb) 학습 웹앱. make out, get over, take off 등 전치사 활용 표현을 마스터하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <LearningProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LearningProvider>
      </body>
    </html>
  );
}
