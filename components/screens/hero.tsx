'use client'
import { LavaLamp } from "../ui/fluid-blob";
import { FileUser, Github, Instagram, Linkedin } from "lucide-react";

export default function Hero(){
    return (
      <div className="h-dvh w-screen flex flex-col justify-center items-center relative">
        <LavaLamp />
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mix-blend-exclusion text-white whitespace-nowrap">
          Logan Whitten
        </h1>
        <div className="text-lg md:text-xl text-center text-white mix-blend-exclusion max-w-2xl leading-relaxed">
          Lighting Technician & Developer.
          <br />
          <div className="pt-2 flex w-full place-items-center place-content-center gap-4">
            <a href="/LoganWhittenResume-3-24-25.pdf">
              <FileUser className="transition-transform duration-300 hover:scale-110" />
            </a>
            <a href="https://instagram.com/loganwhitten512">
              <Instagram className="transition-transform duration-300 hover:scale-110" />
            </a>
            <a href="https://www.linkedin.com/in/loganwhitten/">
              <Linkedin className="transition-transform duration-300 hover:scale-110" />
            </a>
            <a href="https://www.github.com/loganwhitten">
              <Github className="transition-transform duration-300 hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    );
          
}