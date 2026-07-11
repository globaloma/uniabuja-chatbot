import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UniAbuja Assistant | University of Abuja Chatbot",
  description:
    "AI-powered virtual assistant for University of Abuja admission, Post-UTME, courses, accommodation, and clearance enquiries.",
  icons: {
    icon: "/uniabuja-logo.png",
    shortcut: "/uniabuja-logo.png",
    apple: "/uniabuja-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
