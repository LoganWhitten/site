'use client'

import { FileUser, Github, Instagram, Linkedin } from "lucide-react";
import { ShaderAnimation } from "../ui/shader-animation";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import GelPicker from "@/components/gel-picker";

export default function Hero() {
  return (
    <div className="h-dvh w-screen flex flex-col justify-center items-center relative">
      <ShaderAnimation />
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
        <div className="flex w-full place-content-center mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <RainbowButton size="lg">GelTools</RainbowButton>
            </PopoverTrigger>
            <PopoverContent 
              align="center" 
              sideOffset={8} 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-0 bg-black border border-white shadow-xl rounded-lg z-[100] mix-blend-normal"
            >
              <GelPicker />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}