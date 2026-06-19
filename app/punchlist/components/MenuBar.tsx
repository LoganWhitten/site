import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square } from "lucide-react";
import { clearDB } from "../db/dexie";
import LogButton from "./LogButton";

export default function MenuBar({
  jobNumberInput,
  setJobNumberInput,
}: {
  jobNumberInput: string;
  setJobNumberInput: Function;
}) {
  return (
    <div className="flex gap-2 flex-col place-content-center">
      <div className="flex place-content-center"></div>
      <div className="flex w-full place-content-center">
        <LogButton variant={'outline'} jobNumber={jobNumberInput} punchType={"Work Start"}>
          Log Time<Play />
        </LogButton>
      </div>
    </div>
  );
}
