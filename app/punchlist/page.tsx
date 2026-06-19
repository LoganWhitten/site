"use client";

import { useState } from "react";
import { clearDB, db } from "./db/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import MenuBar from "./components/MenuBar";
import DayCard from "./components/DayCard";
import { Button } from "@/components/ui/button";

export default function Page() {
  const PunchList = useLiveQuery(() => db.punches.toArray());
  let [jobNumberInput, setJobNumberInput] = useState("");
  return (
    <div className="dark w-screen flex flex-col gap-4 px-2">
      <div>
        <a href="/">
          <h1 className=" text-[rgb(243,90,92)]">Logan Whitten</h1>
        </a>
        <div className="">PunchList</div>
        <MenuBar
          jobNumberInput={jobNumberInput}
          setJobNumberInput={setJobNumberInput}
        />
      </div>{" "}
      <span className="w-full flex place-content-center">
        You've tracked 41.25 Hrs this week.
      </span>
      <DayCard day="Monday" />
      <DayCard day="Tuesday" />
      <DayCard day="Wednesday" />
      <DayCard day="Thursday" />
      <DayCard day="Friday" />
      <DayCard day="Saturday" />
      <DayCard day="Sunday" />
      <Button
        variant={"destructive"}
        onClick={() => clearDB()}
        className="h-16"
      >
        Clear Week
      </Button>
    </div>
  );
}
