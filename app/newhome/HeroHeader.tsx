import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Paperclip } from "lucide-react";
import Link from "next/link";

export default function HeroHeader() {
  return (
    <div className="flex place-items-center gap-2 place-content-between fixed w-screen h-16 bg-black/20 backdrop-blur-xs border-b px-6">
      <div className="hidden md:block text-xl">
        Lighting Integrator & Programmer
      </div>
      <div className="md:hidden">Integration & Programming</div>
      <Link
        href="/newhome"
        className="text-xl text-center w-screen md:text-4xl font-bold"
      >
        Logan Whitten
      </Link>
      <Link href={'/resume.pdf'}>
        <div className="flex bg-white/24 md:bg-transparent rounded-lg p-2 md:text-xl place-items-center">
          <Paperclip height={17}/>
          Resume
        </div>
      </Link>
    </div>
  );
}
