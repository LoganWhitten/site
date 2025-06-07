'use client'

import { ReactNode } from "react";
import "./globals.css"
import { ReactLenis, useLenis } from "lenis/react";

export default function RootLayout({children}: {children: ReactNode}){
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis);
  });
  return (
    <html>
      <body className="h-lvh w-full dark">
        <ReactLenis root />
        <div className="fixed text-2xl bg-neutral-900 flex place-items-center place-content-center z-10 rounded-xl p-2 h-14 w-screen cursor-pointer">
          {" "}
          Logan Whitten
        </div>
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}