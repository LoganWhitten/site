"use client";

import { useState } from "react";
import { clearDB, db, Punch } from "./db/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogButton from "./components/LogButton";
import { Play, Square } from "lucide-react";

export default function Page() {
  const PunchList = useLiveQuery(() => db.punches.toArray());
  let [jobNumberInput, setJobNumberInput] = useState("");
  return (
    <div className="h-svh">
      <nav>
        <a className="text-2xl text-orange-700" href="/">
          Logan Whitten
        </a>
      </nav>
      <div>PunchList</div>
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
        <div className="bottom-2 absolute w-screen flex-col place-content-center">
          <div className="w-screen flex place-content-center gap-4">
            <LogButton jobNumber={jobNumberInput} punchType={"Work Start"}>
              Work <Play />
            </LogButton>
            <LogButton
              jobNumber={jobNumberInput}
              variant="destructive"
              punchType={"Work End"}
            >
              Work <Square />
            </LogButton>
            <LogButton jobNumber={jobNumberInput} punchType={"Travel Start"}>
              Travel <Play />
            </LogButton>
            <LogButton
              jobNumber={jobNumberInput}
              variant="destructive"
              punchType={"Travel End"}
            >
              Travel <Square />
            </LogButton>
          </div>
          <div className="flex pt-3 place-content-center">
            <Input
              className="h-8 w-1/3 "
              value={jobNumberInput}
              onChange={(e) => setJobNumberInput(e.target.value)}
              placeholder="job #"
            />
            <Button onClick={() => clearDB()} className="h-8">
              Clear DB
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
