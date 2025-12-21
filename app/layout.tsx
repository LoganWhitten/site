import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--rubik",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Logan Whitten's Site",
  description: "Logan Whitten is a lighting technician & developer studying lighting technology at UNCSA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} antialiased`}
      >
        <div className="overscroll-none dark bg-black">
        {children}
        </div>
      </body>
    </html>
  );
}
