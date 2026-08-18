import type { Metadata } from "next";
import "./globals.css";
import {Geist} from 'next/font/google'
import HeroFooter from "./newhome/HeroFooter";
import HeroHeader from "./newhome/HeroHeader";

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
      <body className='bg-[#1b1b1b]'>
        <HeroHeader />
            <div className="pt-5 grid place-content-center">
            {children}
            </div>
            <HeroFooter />
      </body>
    </html>
  );
}
