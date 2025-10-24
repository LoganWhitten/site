'use client'

import { FileUser, Github, Instagram, Linkedin, Mail } from "lucide-react";

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
        <div className="flex flex-col">
          Lighting Technician & Developer.
          <div className="pt-2 relative flex w-full place-items-center place-content-center gap-4">
            <a href="/LoganWhittenResume-3-24-25.pdf">
              <FileUser className="transition-transform duration-300 hover:scale-110" />
            </a>
            <a href="mailto:logan@loganwhitten.com">
              <Mail className="transition-transform duration-300 hover:scale-110" />
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
    </div>
  );
}