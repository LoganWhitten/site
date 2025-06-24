import { ReactNode } from "react";
import "./globals.css"
import { ReactLenis } from "lenis/react";
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