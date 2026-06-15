import type { Metadata } from "next";
import "./globals.css";
import {Geist} from 'next/font/google'

const geist = Geist({
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "Logan Whitten",
  description: "Logan Whitten is a senior at UNCSA currently interning at Murphy Lighting Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html
      lang="en"
    >
      <body className='px-2 flex bg-[#1b1b1b]'>{children}</body>
    </html>
  );
}
