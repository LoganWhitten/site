'use client'

import { FileUser, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { ShootingStarsDemo } from "../ui/s-stars";
import { Input } from "../ui/input";
import { useState, useCallback } from "react";

export default function Hero() {
  const [gelColor, setGelColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");

  const handleGelSearch = useCallback((value: string) => {
    setGelColor(value);
  }, []);

  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color);
  }, []);

  return (
    <div className="h-svh w-screen flex flex-col justify-center items-center">
      <ShootingStarsDemo gelSearchQuery={gelColor} onTextColorChange={handleTextColorChange} />
      <h1 
        className="text-5xl md:text-8xl font-bold tracking-tight whitespace-nowrap backdrop-blur-sm transition-colors duration-1500 ease-in-out"
        style={{ color: textColor }}
      >
        Logan Whitten
      </h1>
      <div className="md:text-xl text-center max-w-2xl leading-relaxed">
        <div className="relative">
          <p 
            className="transition-colors duration-1500 ease-in-out"
            style={{ color: textColor }}
          >
            Lighting Technician & Developer.
          </p>
          <div 
            className="pt-2 relative flex flex-col md:flex-row w-full place-items-center place-content-center gap-4 transition-colors duration-1500 ease-in-out"
            style={{ color: textColor }}
          >
            <div className="flex gap-4">
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
            <Input 
              placeholder="Type a Gel Color..."
              onChange={(e) => handleGelSearch(e.target.value)}
              value={gelColor}
              className="max-w-xs backdrop-blur-sm bg-white/10 border-white/20 placeholder:text-white/50 transition-all duration-1500 ease-in-out"
              style={{ 
                color: textColor,
                borderColor: `${textColor}33`,
                backgroundColor: `${textColor}10`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}