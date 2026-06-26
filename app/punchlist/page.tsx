"use client";

import { useEffect, useState } from "react";
import { clearDB, db, Punch } from "./dexie";
import { useLiveQuery } from "dexie-react-hooks";
import DayCard from "./components/DayCard";
import { Button } from "@/components/ui/button";
import LogTime from "./components/LogTime";
import ModifyTime from "./components/ModifyTime";

export default function Page() {
  const [inJob, setInJob] = useState(false);
  const [jobTime, setJobTime] = useState<Date>();
  const [currentPunch, setCurrentPunch] = useState<Punch>();
  const [totalTime, setTotalTime] = useState(0);

  const todaysDate = new Date();

  const PunchList = useLiveQuery(() => db.punches.toArray());
  // Calculate Punchtime
  useEffect(() => {
    if (currentPunch?.startTime) {
      const time = new Date(currentPunch.startTime);
      setJobTime(time);
    }
  }, [currentPunch]);

  // On init
  useEffect(() => {
    db.punches
      .orderBy("id")
      .last()
      .then((p) => {
        if (p?.endTime == null && p?.startTime != null) {
          //we're in a job
          setInJob(true);
          setCurrentPunch(p);
        } else {
          //we're not in a job
          setInJob(false);
        }
      });
  }, []);
  return (
    <div className="dark w-screen left-0 absolute flex flex-col px-2">
      <div>
        <a href="/">
          <h1 className="text-[rgb(243,90,92)]">Logan Whitten</h1>
        </a>
        <div className="">PunchList</div>
        {inJob && (
          <div>
            {currentPunch != null && (
              <ModifyTime setInJob={setInJob} currentPunch={currentPunch} />
            )}
            <span className="w-full flex place-content-center mb-1 mt-4">
              You've been on the clock since
              {jobTime?.toLocaleDateString() == todaysDate.toLocaleDateString()
                ? " "
                : `${jobTime?.toLocaleDateString()} `}
              {jobTime?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </span>
          </div>
        )}
        {!inJob && (
          <div>
            <LogTime setCurrentPunch={setCurrentPunch} setInJob={setInJob} />
            <span className="w-full flex place-content-center mb-1 mt-4">
              You've tracked{" "}
              {Number(totalTime.toFixed(2)) < 0.01
                ? "0 hours"
                : `${totalTime.toFixed(2)} hours`}{" "}
              so far this week.
            </span>
          </div>
        )}
      </div>{" "}
      <DayCard day={0} setTotalTime={setTotalTime} />
      <DayCard day={1} setTotalTime={setTotalTime} />
      <DayCard day={2} setTotalTime={setTotalTime} />
      <DayCard day={3} setTotalTime={setTotalTime} />
      <DayCard day={4} setTotalTime={setTotalTime} />
      <DayCard day={5} setTotalTime={setTotalTime} />
      <DayCard day={6} setTotalTime={setTotalTime} />
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
