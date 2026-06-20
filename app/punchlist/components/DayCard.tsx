import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  BriefcaseBusiness,
  Car,
  ChevronRight,
  Hamburger,
} from "lucide-react";
import { db } from "../dexie";
import { useEffect, useState } from "react";

export default function DayCard({ day }: { day: number }) {
  const [totalTime, setTotalTime] = useState(0)
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function setToDate(date: Date, D: number) {
    var day = date.getDay();
    date.setHours(-24 * (day - (1 + D)));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(1);
    return date;
  }

  useEffect(() => {
    const startTime = setToDate(new Date(), day);
    const endTime = startTime.getTime() + 86400000;
    // calculate that date's start and end times in UNIX milliseconds
    db.punches
      .where("startTime")
      .between(startTime.getTime(), endTime)
      .toArray()
      .then((d) => {
        for (let index = 0; index < d.length; index++) {
          const element = d[index];
          let timeWorked = 0
          if (element.endTime) {
          timeWorked = (element.endTime) - element.startTime
          }
          const hours = ((timeWorked / 1000) / 60) / 60
          console.log({hours, timeWorked})
          setTotalTime((prev) => (prev + hours))
        }
      });
  }, []);

  //query DB for only times that START between

  return (
    <Card className="hover:bg-white/1 cursor-default">
      <CardHeader>
        <CardTitle>{days[day]}</CardTitle>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <BriefcaseBusiness size={20} />
            3.25
          </div>
          <div className="flex gap-1">
            <Car size={20} />
            1.25
          </div>
          <div className="flex gap-1">
            <Hamburger size={19} />
            0.5
          </div>
        </div>
        <CardAction className="flex place-items-center place-content-center h-full">
          {totalTime.toFixed(2)} Hrs <ChevronRight />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
