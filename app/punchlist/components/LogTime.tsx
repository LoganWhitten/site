import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { db } from "../dexie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LogTime({
  setCurrentPunch,
  setInJob,
}: {
  setCurrentPunch: Function;
  setInJob: Function;
}) {
  return (
    <div className="flex gap-2 flex-col place-content-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"outline"} className={`h-16 w-full rounded-md`}>
            Log Time <ChevronRight />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle>Log Time</AlertDialogTitle>
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col place-items-start">
                Start Time
                <Input
                  id="StartTime"
                  placeholder="--:-- --"
                  className="max-w-64"
                  type="time"
                />
              </div>
              <div className="flex flex-col place-items-start">
                Job #
                <Input id="JobNumber" placeholder="440..." className="h-12" />
              </div>
              <div className="flex flex-col place-items-start">
                Log Type
                <RadioGroup defaultValue="comfortable" className="w-fit">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">On-Site</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Fabrication</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Travel</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log({
                  jobNumber: 11,
                  punchType: "12",
                  time: Date.now(),
                });
                db.punches
                  .add({
                    jobNumber: "jobNumber",
                    punchType: "12",
                    startTime: Date.now(),
                  })
                  .then((id) => {
                    db.punches.get(id).then((punch) => {
                      console.log("punch is: ", punch);
                      setCurrentPunch(punch);
                      setInJob(true);
                    });
                  });
              }}
            >
              Log
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
