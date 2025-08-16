import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const NunitoFont = Nunito({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDP Junior",
  description: "PDP Junior - LMS platformasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${NunitoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
