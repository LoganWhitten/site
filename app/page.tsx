"use client";

import { createContext, useState } from "react";
import ColorText from "./components/ColorText";
import { fetchJSONData } from "./src/GelLogic";

type ColorContextValue = string;
export const ColorContext = createContext<ColorContextValue | null>(null);
export default function Home() {
  const [color, setColor] = useState("rgb(243,90,92)");
  const [pronoun, setPronoun] = useState(" My");
  return (
    <div className="px-3">
    <ColorContext value={color}>
      <h1 id="header">
        <span>
          Hey! I'm <ColorText>Logan Whitten</ColorText>
        </span>
        <div className="flex gap-1 pb-2 md:pt-4">
          <a
            className="animate-[fadeInSuperDelay_1.5s_ease-in-out]"
            href="https://github.com/loganwhitten/"
            target="_blank"
          >
            <img id="socialIcon" src="/images/github.svg" />
          </a>
          <a
            href="https://instagram.com/loganwhitten512"
            className="animate-[fadeInSuperDelay_2s_ease-in-out]"
            target="_blank"
          >
            <img id="socialIcon" src="/images/instagram.svg" />
          </a>
          <a
            href="https://linkedin.com/in/loganwhitten"
            className="animate-[fadeInSuperDelay_2.5s_ease-in-out]"
            target="_blank"
          >
            <img id="socialIcon" src="/images/linkedin.svg" />
          </a>
        </div>
      </h1>
      <img id="headerImg" src="/images/me.png" alt="Logan Whitten" />
      <br />
      <div className="animate-[fadeInSuperDelay_3s_ease-in-out]">
        <p>
          I'm a senior at <ColorText>UNCSA</ColorText>, I love
          <ColorText>Rock Climbing </ColorText>and
          <ColorText>Coding Projects</ColorText>.
          {ColorContext.toString().toUpperCase() == "R32" && "my"}
          {pronoun} favorite Color is{" "}
          <span
            id="ColorInput"
            onInput={(e) => {
              e.currentTarget.textContent.toUpperCase() == "R32"
                ? setPronoun(" My")
                : setPronoun(" Your");
              fetchJSONData(
                e.currentTarget.textContent.toUpperCase(),
                setColor,
              );
            }}
            contentEditable={true}
            suppressContentEditableWarning={true}
          >
            R32
          </span>
          .
        </p>
        <br />
        <p>
          Currently I'm interning at
          <a target="_blank" href="https://murphylighting.com">
            <ColorText>Murphy Lighting Systems </ColorText>
          </a>
          where I've had the opportunity to work on projects for
          <a target="_blank" href="https://www.royalcaribbean.com">
            <ColorText>Royal Carribean</ColorText>
          </a>
          ,
          <a target="_blank" href="https://www.udx.com/en/us">
            <ColorText>Universal Destinations & Experiences</ColorText>
          </a>
          , 
          <a target="_blank" href="https://www.delawarenorth.com/">
            <ColorText>Kennedy Space Center </ColorText>
          </a>
          and more.
        </p>
        <br />
        <p>
          At school I've had the opportunity to further my skills in
          <ColorText>GrandMA3 </ColorText> programming, as well as
          <ColorText>theatrical </ColorText> and
          <ColorText>concert</ColorText> lighting rig
          <ColorText>design</ColorText> and{" "}
          <ColorText>electrification</ColorText>.
        </p>
        <br />
        <div>
          <h3 className="text-xl">Some Selected Work:</h3>
          <a
            id="project"
            href="https://github.com/loganwhitten/site"
            target="_blank"
          >
            <div id="projectInfoDiv">
              <p className=" text-lg">This Site</p>
              <p className="text-xs">
                Next.JS containerized and running on a Raspberry PI. Built
                entirely by me.
              </p>
            </div>
            <p id="projectProgress">
              <img src="/images/github.svg" id="projectIcon" />
            </p>
          </a>
        </div>
      </div>
    </ColorContext>
        </div>
  );
  
}
