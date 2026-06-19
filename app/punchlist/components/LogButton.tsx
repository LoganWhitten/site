import { Button } from "@/components/ui/button";
import { db } from "../db/dexie";

import { Play } from "lucide-react";

type Variants =
  | "link"
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | null
  | undefined;
export default function LogButton({
  children,
  jobNumber,
  punchType,
  variant,
}: {
  children: React.ReactNode;
  punchType: string;
  jobNumber: string;
  variant?: Variants;
}) {
  return (
    <Button
      className={`aspect-square ${variant != "destructive" ? "border-white bg-gray-950" : "bg-gray-950"}  h-16 rounded-md`}
      onClick={() => {
        console.log({
          jobNumber: jobNumber,
          punchType: punchType,
          time: Date.now(),
        });
        db.punches.add({
          jobNumber: jobNumber,
          punchType: punchType,
          time: Date.now(),
        });
      }}
    >
      {children}
    </Button>
  );
}
