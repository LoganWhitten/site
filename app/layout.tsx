import "./globals.css";
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { EtheralShadow } from "@/components/ui/etheral-shadow";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://next-mdx-blog.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: "Logan Whitten",
  description:
    "Portfolio and personal website of Logan Whitten, a lighting integrator and programmer studying at UNCSA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.className, "font-sans", geist.variable)}
    >
      <body className="antialiased dark tracking-tight">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 text-gray-900 dark:text-zinc-200">
          <main className="max-w-[60ch] mx-auto w-full space-y-6">
            {children}
          </main>
          <Footer />
        </div>
        <div className="fixed inset-0 -z-10 opacity-25">
          <EtheralShadow
            color="rgba(128, 128, 128, 1)"
            animation={{ scale: 100, speed: 65 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  const links = [
    { name: "@loganwhitten512", url: "https://instagram.com/loganwhitten512" },
    { name: "linkedin", url: "https://www.linkedin.com/in/loganwhitten" },
    { name: "github", url: "https://github.com/loganwhitten" },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
