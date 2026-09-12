"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

export default function HeroItem({
  name,
  subtitle,
  number,
  img,
  gallery,
  id,
  setActive,
  activeTab,
}: {
  name: string;
  subtitle: string;
  number: string;
  img: string;
  id: number;
  gallery: [string];
  setActive: Dispatch<SetStateAction<number>>;
  activeTab: number;
}) {
  return (
    <div
      onClick={() => {
        if (activeTab == id) {
          setActive(0);
        } else {
          setActive(id);
        }
      }}
      className={`flex flex-col transition-all ease-in-out duration-500 px-5  border-b ${activeTab == id ? "h-[80vh]" : "h-36"} hover:text-black hover:bg-white/75 cursor-pointer animate-in`}
    >
      <div className="flex w-full place-content-between place-items-center">
        <img
          className={`aspect-video w-1/3 h-full lg:w-auto lg:h-36 py-2 rounded-xl object-cover`}
          src={img}
        />
        <div className="flex flex-col h-36 gap-2 flex-1 place-content-center text-center place-items-center">
          <span className="lg:text-6xl text-2xl font-bold">{name}</span>
          <span className="lg:text-xl">{subtitle}</span>
        </div>
        <span className="lg:text-8xl text-2xl  font-bold text-center">
          {number}
        </span>
      </div>
      <div
        className={`transition-all ease-in-out gap-4 flex flex-col duration-500 min-h-0 ${activeTab == id ? "border-t border-dashed block opacity-100" : "hidden opacity-0"}`}
      >
        <div className="shrink-0 lg:h-32 h-48 place-content-center flex flex-col">
          <p className="lg:text-4xl text-2xl">Writeup Coming Soon... </p>
          <div className="flex place flex-col lg:text-xl text-lg overflow-auto">
         </div>
        </div>
        {
          /*
          <div className="min-h-0 pb-2 flex-1 flex  overflow-scroll overflow-y-hidden place-items-center gap-8">
            {gallery.map((name, id) => (
              <img
              key={id}
              className="h-full max-h-full w-auto rounded-lg aspect-square object-cover"
              src={name}
              />
            ))}
          </div>
          */
        }
      </div>
    </div>
  );
}
