"use client";

import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { searchForGel } from "@/lib/gel/search";
import { Input } from "@/components/ui/input";
import CopyBtn from "./copy-btn";

export default function GelPicker() {
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(searchForGel(search));
  }, [search]);
  return (
    <div className="md:flex border bg-black rounded-md p-4 place-items-center place-content-center text-xl text-white gap-5 min-w-[300px] max-w-[350px]">
      <div className="grid items-center gap-2">
        <Label htmlFor="gel">Type a Gel Color</Label>
        <div className="flex dark">
          <Input
            className="bg-black outline"
            id="gel"
            maxLength={10}
            placeholder="ex. R3202"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className=" py-2">
          <CopyBtn color={color} />
        </div>
      </div>
      <div
  className="h-40 w-40 flex rounded-lg z-10 outline outline-white place-content-center place-items-center text-white"
        style={{ backgroundColor: color || "#000000" }}
      >
        {search}
      </div>
    </div>
  );
}