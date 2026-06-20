"use client";

import { useEffect, useState } from "react";
import { clearDB, db } from "./dexie";
import { useLiveQuery } from "dexie-react-hooks";
import DayCard from "./components/DayCard";
import { Button } from "@/components/ui/button";
import LogTime from "./components/LogTime";
import ModifyTime from "./components/ModifyTime";

export default function Page() {
  const [inJob, setInJob] = useState(false);
  const [jobTime, setJobTime] = useState<Date>();
  const todaysDate = new Date();

  const PunchList = useLiveQuery(() => db.punches.toArray());
  useEffect(() => {
    db.punches
      .orderBy("id")
      .last()
      .then((p) => {
        if (p?.endTime == null && p?.startTime != null) {
          //we're in a job
          setInJob(true);
          const time = new Date(p.startTime);
          setJobTime(time);
        } else {
          //we're not in a job
          setInJob(false);
        }
      });
  }, []);
  return (
    <div className="dark w-screen flex flex-col gap-4 px-2">
      <div>
        <a href="/">
          <h1 className=" text-[rgb(243,90,92)]">Logan Whitten</h1>
        </a>
        <div className="">PunchList</div>
        {inJob && (
          <div>
            <ModifyTime />
            <span className="w-full flex place-content-center">
              You've been on the clock since
              {jobTime?.toLocaleDateString() == todaysDate.toLocaleDateString()
                ? " "
                : `${jobTime?.toLocaleDateString()} `}
              {jobTime?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}.
            </span>
          </div>
        )}
        {!inJob && (
          <div>
            <LogTime />
            <span className="w-full flex place-content-center">
              You've tracked 41.25 Hrs so far this week.
            </span>
          </div>
        )}
      </div>{" "}
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
