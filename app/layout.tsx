import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local';

const geist = localFont({
  src: '../public/fonts/Geist-VariableFont_wght.ttf',
})

const tiktokSans = localFont({
  src: '../public/fonts/TikTokSans.ttf',
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
      <body className='px-2'>{children}</body>
    </html>   
  );
}
