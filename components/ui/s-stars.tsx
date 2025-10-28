"use client";
import React, { useState, useEffect } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { cmykToHex } from "@/lib/gel/toHex";

interface Gel {
  D: string; // CMYK values as comma-separated string
  N: string; // Name/ID
}

interface GelData {
  ColorPalette: {
    ColorList: {
      C: Gel[];
    };
  };
}

interface ShootingStarsDemoProps {
  gelSearchQuery?: string;
  onTextColorChange?: (color: string) => void;
}

const defaultColors = {
  star1: { starColor: "#FFFFFF", trailColor: "#CCCCCC" },
  star2: { starColor: "#FFFFFF", trailColor: "#CCCCCC" },
  star3: { starColor: "#FFFFFF", trailColor: "#CCCCCC" },
};

// Helper function to adjust color brightness
function adjustColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const adjustedR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const adjustedG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const adjustedB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`.toUpperCase();
}

// Helper function to invert a color
function invertColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;
  
  return `#${invertedR.toString(16).padStart(2, '0')}${invertedG.toString(16).padStart(2, '0')}${invertedB.toString(16).padStart(2, '0')}`.toUpperCase();
}

// Helper function to check if a color is light (returns true if light, false if dark)
function isColorLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate relative luminance using the formula: (0.299*R + 0.587*G + 0.114*B)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  
  return luminance > 127.5; // Return true if light, false if dark
}

// Helper function to darken a color for better visibility
function ensureVisibleBackground(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // If color is too light (pale), darken it significantly
  if (luminance > 200) {
    const factor = 0.4; // Darken to 40% of original
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase();
  }
  
  // If color is too dark (close to black), lighten it
  if (luminance < 30) {
    const boost = 50;
    const newR = Math.min(255, r + boost);
    const newG = Math.min(255, g + boost);
    const newB = Math.min(255, b + boost);
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase();
  }
  
  return hex;
}

export function ShootingStarsDemo({ gelSearchQuery = "", onTextColorChange }: ShootingStarsDemoProps) {
  const [colors, setColors] = useState(defaultColors);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [gels, setGels] = useState<Gel[]>([]);

  // Load gels data
  useEffect(() => {
    fetch("/gels.json")
      .then((res) => res.json())
      .then((data: GelData) => {
        setGels(data.ColorPalette.ColorList.C);
      })
      .catch((err) => console.error("Failed to load gels:", err));
  }, []);

  // Search for gel and update colors with smooth transition
  useEffect(() => {
    if (!gelSearchQuery || gels.length === 0) {
      // Fade back to default colors
      setColors(defaultColors);
      setBackgroundColor("#000000");
      onTextColorChange?.("#FFFFFF"); // White text for black background
      return;
    }

    const query = gelSearchQuery.toUpperCase().trim();
    
    // Only search if query has at least 2 characters or is a complete number
    if (query.length < 2) {
      setColors(defaultColors);
      setBackgroundColor("#000000");
      onTextColorChange?.("#FFFFFF");
      return;
    }
    
    // Normalize query by removing leading zeros from numbers (R02 -> R2, L001 -> L1)
    const normalizedQuery = query.replace(/([A-Z]+)0+(\d+)/, '$1$2');
    
    // Try exact match first, then contains
    const matchedGel = gels.find((gel) => gel.N.toUpperCase() === normalizedQuery) || 
                       gels.find((gel) => gel.N.toUpperCase() === query) ||
                       gels.find((gel) => gel.N.toUpperCase().includes(normalizedQuery)) ||
                       gels.find((gel) => gel.N.toUpperCase().includes(query));

    if (matchedGel) {
      // Parse CMYK values from the "D" field
      const cmykValues = matchedGel.D.split(",").map((v) => parseFloat(v));
      
      if (cmykValues.length === 4) {
        const [c, m, y, k] = cmykValues;
        const hexColor = cmykToHex(c, m, y, k);
        
        // Validate hex color
        if (hexColor && hexColor.match(/^#[0-9A-F]{6}$/i)) {
          // Ensure the background color is visible (not too pale or too dark)
          const visibleBgColor = ensureVisibleBackground(hexColor);
          
          // Set background to the adjusted gel color
          setBackgroundColor(visibleBgColor);
          
          // Determine text color based on background luminance
          const textColor = isColorLight(visibleBgColor) ? "#000000" : "#FFFFFF";
          onTextColorChange?.(textColor);
          
          // Create inverse color for stars
          const inverseColor = invertColor(visibleBgColor);
          const lighterInverse = adjustColor(inverseColor, 1.1);
          const darkerInverse = adjustColor(inverseColor, 0.9);
          
          setColors({
            star1: { starColor: inverseColor, trailColor: lighterInverse },
            star2: { starColor: lighterInverse, trailColor: inverseColor },
            star3: { starColor: darkerInverse, trailColor: inverseColor },
          });
        }
      }
    } else {
      // No match found, keep default
      setColors(defaultColors);
      setBackgroundColor("#000000");
      onTextColorChange?.("#FFFFFF");
    }
  }, [gelSearchQuery, gels, onTextColorChange]);

  return (
    <div 
      className="h-svh w-full absolute z-0 overflow-hidden transition-colors duration-1500 ease-in-out"
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 transition-all duration-1500 ease-in-out"
          style={{
            background: `radial-gradient(ellipse_at_center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 80%)`
          }}
        />
        <div className="stars absolute inset-0" style={{
          transition: 'opacity 1s ease-in-out',
        }} />
      </div>

      <ShootingStars
        starColor={colors.star1.starColor}
        trailColor={colors.star1.trailColor}
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
        key="star1"
      />
      <ShootingStars
        starColor={colors.star2.starColor}
        trailColor={colors.star2.trailColor}
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
        key="star2"
      />
      <ShootingStars
        starColor={colors.star3.starColor}
        trailColor={colors.star3.trailColor}
        minSpeed={20}
        maxSpeed={40}
        minDelay={1500}
        maxDelay={3500}
        key="star3"
      />

      <style jsx>{`
        .stars {
          background-image: radial-gradient(
              2px 2px at 20px 30px,
              ${colors.star1.starColor},
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(2px 2px at 40px 70px, ${colors.star2.starColor}, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 50px 160px, ${colors.star3.starColor}, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 90px 40px, ${colors.star1.starColor}, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 130px 80px, ${colors.star2.starColor}, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 160px 120px, ${colors.star3.starColor}, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.5;
          transition: background-image 1.5s ease-in-out;
        }

        @keyframes twinkle {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
