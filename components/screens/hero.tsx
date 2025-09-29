'use client'

import { FileUser, Github, Instagram, Linkedin } from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import GelPicker from "@/components/gel-picker";
import Beams from "../ui/beams";

export default function Hero() {
  return (
    <div className="h-svh w-screen flex flex-col justify-center items-center relative">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
      <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-gray-100 whitespace-nowrap backdrop-blur-sm">
        Logan Whitten
      </h1>
      <div className="md:text-xl text-center text-white max-w-2xl leading-relaxed">
        <span className="">
          Lighting Technician & Developer.
          <br />
          <div className="pt-2 relative flex w-full place-items-center place-content-center gap-4">
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
        </span>
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