import { Button } from "@/components/ui/button";
import { ChevronRight, Settings } from "lucide-react";
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

export default function ModifyTime() {
  return (
    <div className="flex gap-2 flex-col place-content-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className={`h-16 w-full rounded-md`}
            onClick={() => {
              console.log({
                jobNumber: 11,
                punchType: "12",
                time: Date.now(),
              });
              db.punches.add({
                jobNumber: "jobNumber",
                punchType: "12",
                startTime: Date.now(),
              });
            }}
          >
            Modify Time <Settings />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle>Modify Time</AlertDialogTitle>
            <div className="w-full flex flex-col gap-2">

              <div className="flex flex-col place-items-start">
                End Time
                <Input
                  id="StartTime"
                  placeholder="--:-- --"
                  className="max-w-64"
                  type="time"
                  />
              </div>
              <div className="flex flex-col place-items-start">
                New Job #
                <Input id="JobNumber" placeholder="440..." className="h-12" />
              </div>
              <div className="flex flex-col place-items-start">
                New Type
                <RadioGroup  className="w-fit">
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
            <AlertDialogAction disabled>Log</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
