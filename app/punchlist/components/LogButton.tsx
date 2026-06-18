import { Button } from "@/components/ui/button";
import { db } from "./db/dexie";


type Variants = "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined
export default function LogButton({
    label,
    jobNumber,
    punchType,
    variant
}: {
    label: string;
    punchType: string;
    jobNumber: string;
    variant?: Variants;
}) {
    return (
    <Button
    variant={variant}
      className={`h-32 border-white ${variant=="destructive"? 'bg-red-950 text-white' : ''}`}
      onClick={() => {
        console.log({jobNumber: jobNumber,
            punchType: punchType,
            time: Date.now(),})
          db.punches.add({
            jobNumber: jobNumber,
            punchType: punchType,
            time: Date.now(),
          });
      }}
    >
      {label}
    </Button>
  );
}
