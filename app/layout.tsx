import { ReactNode } from "react";
import "./globals.css"
import { Metadata } from "next";
import { TabBar } from "@/components/tabs";


export const metadata: Metadata = {
  title: "Logan Whitten",
  description: "Logan Whitten is a lighting technician & developer currently studying at UNCSA.",
};


export default function RootLayout({children}: {children: ReactNode}){

  return (
    <html>
      <body className="h-svh overscroll-none dark w-full">
        <div className="cursor-default">{children}</div>
        <div className="fixed bottom-4 z-50 w-screen flex place-content-center">
          <TabBar />
        </div>
      </body>
    </html>
  );
}