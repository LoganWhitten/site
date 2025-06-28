import { ReactNode } from "react";
import "./globals.css"
import { ReactLenis } from "lenis/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logan Whitten's Site",
  description: "Logan Whitten is a Lighting Technician & Developer currently studying at UNCSA.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};


export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html>
      <body className="h-lvh dark w-full">
        <ReactLenis root />
        <div >{children}</div>
      </body>
    </html>
  );
}