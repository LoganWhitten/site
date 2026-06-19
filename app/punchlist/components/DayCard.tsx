import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BriefcaseBusiness, Car, ChevronRight } from "lucide-react";

export default function DayCard({ day }: { day: string }) {
  return (
    <Card className="hover:bg-white/1 cursor-default">
      <CardHeader>
        <CardTitle>{day}</CardTitle>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <BriefcaseBusiness size={20} />
            3.25
          </div>
          <div className="flex gap-1">
            <Car size={20} />
            1.25
          </div>
          <RadioGroup defaultValue="none" className="flex gap-1">
            <div className="flex items-center gap-1">
              <RadioGroupItem value="none" id="r1" />
              <Label htmlFor="r2">0</Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="30" id="r3" />
              <Label htmlFor="r3">30</Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="60" id="r3" />
              <Label htmlFor="r3">60</Label>
            </div>
          </RadioGroup>
        </div>
        <CardAction className="flex place-items-center place-content-center h-full">
          4.5 Hrs <ChevronRight />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
