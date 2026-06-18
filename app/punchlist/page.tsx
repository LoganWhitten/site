"use client";

import { useState } from "react";
import { clearDB, db, Punch } from "./components/db/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogButton from "./components/LogButton";

export default function Page() {
  const PunchList = useLiveQuery(() => db.punches.toArray());
  let [jobNumberInput, setJobNumberInput] = useState("");
  return (
    <div className="h-[calc(100vh+19rem)]">
      <nav>
        <a className="text-2xl text-orange-700" href="/">
          Logan Whitten
        </a>
      </nav>
      <div>Timr</div>
      <ul className="grid auto-cols grid-cols-2">
        {PunchList?.map((f: Punch) => {
          const date = new Date(f.time);
          return (
            <li
              className="bg-black m-2 p-1 border sm:border-[.25px] rounded-md grid border-white"
              key={f.id}
            >
              <span className="text-orange-200">
                {f.jobNumber != "" ? `Job Number: ${f.jobNumber} ` : ""}
              </span>
              <span>
                {" "}
                Start Time: {date.toLocaleDateString()} at{" "}
                {date.toLocaleTimeString()}
              </span>
              Punch Type: {f.punchType}
            </li>
          );
        })}
      </ul>
      <div className="">
        <div className="fixed bottom-0 w-screen flex-col place-content-center">
          <div className="flex">
            <Input
              className="h-16 text-4xl bg-[#1b1b1b]"
              value={jobNumberInput}
              onChange={(e) => setJobNumberInput(e.target.value)}
              placeholder="job #"
              type="number"
            />
            <Button onClick={() => clearDB()} className="h-16">
              Clear DB
            </Button>
          </div>

          <div className="grid grid-cols-4">
            <LogButton
              label="Work Start"
              jobNumber={jobNumberInput}
              punchType={"Work Start"}
            />
            <LogButton
              label="Work End"
              jobNumber={jobNumberInput}
              variant="destructive"
              punchType={"Work End"}
            />
            <LogButton
              label="Travel Start"
              jobNumber={jobNumberInput}
              punchType={"Travel Start"}
            />
            <LogButton
              label="Travel End"
              jobNumber={jobNumberInput}
              variant="destructive"
              punchType={"Travel End"}
            />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
