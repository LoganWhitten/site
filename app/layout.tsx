import { ReactNode } from "react";
import "./globals.css"
import { ReactLenis } from "lenis/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logan Whitten",
  description: "Logan Whitten is a lighting technician & developer currently studying at UNCSA.",
};


export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html>
      <body className="h-svh dark w-full">
        <ReactLenis root />
        <div >{children}</div>
      </body>
    </html>
  );
}