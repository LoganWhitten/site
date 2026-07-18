import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function HeroHeader() {
  return (
    <div className="flex place-items-center gap-2 place-content-between fixed w-screen h-16 bg-black/20 backdrop-blur-xs border px-2">
      <div className="text-xl">Lighting Integrator & Programmer</div>
      <Link href="/newhome" className="text-4xl font-bold">Logan Whitten</Link>
      <div>
        <Badge variant="outline" className="">
          <GraduationCap />
          UNCSA LX '27
        </Badge>
        <Badge variant="outline" className=" bg-green-950">
          <Briefcase />
          Murphy Lighting Systems
        </Badge>
      </div>
    </div>
  );
}
