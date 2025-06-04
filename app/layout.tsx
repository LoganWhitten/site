import { ReactNode } from "react";
import "./globals.css"

export default function RootLayout({children}: {children: ReactNode}){
  return (
    <html>
      <body className="h-lvh w-full dark">
        <div className="fixed text-2xl bg-neutral-900 flex place-items-center place-content-center z-10 rounded-xl p-2 h-14 w-screen cursor-pointer"> Logan Whitten</div>
        <div className="pt-14">

        {children}
        </div>
      </body>
    </html>
  );
}