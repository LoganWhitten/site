import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Logan Whitten",
  description:
    "Logan Whitten is an award winning GrandMA3 programmer and lighting technician currently studying at the University of North Carolina School of the Arts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-lvh w-screen overscroll-none dark`}
      >
        {children}
        <div className="absolute bottom-5 align-middle flex self-center w-screen place-content-center text-center">
          additional coming soon :)
        </div>
      </body>
    </html>
  );
}
