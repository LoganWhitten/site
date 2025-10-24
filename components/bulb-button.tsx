"use client";

import { useState, useRef, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpandableLightbulbInput() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setValue("");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex items-center gap-2 backdrop-blur-md overflow-hidden rounded-full border-1 text-white border-primary transition-all duration-300 ease-in-out origin-left",
          isExpanded
            ? "w-80 px-4 py-3"
            : "w-14 h-14 cursor-pointer hover:scale-105"
        )}
        onClick={!isExpanded ? handleToggle : undefined}
      >
        <Lightbulb
          className={cn(
            "shrink-0 transition-all text-white duration-300",
            isExpanded ? "hidden" : "h-6 w-6 mx-auto"
          )}
        />

        {isExpanded && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a gel color..."
            className="flex-1 bg-transparent text-white placeholder:text-white outline-none"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
