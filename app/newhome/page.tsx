import { Badge } from "@/components/ui/badge";
import HeroItem from "./HeroItem";
import { Briefcase, GraduationCap } from "lucide-react";
import HeroHeader from "./HeroHeader";

export default function NewHome() {
  return (
    <div className="bg-black pt-11 w-screen dark">
      <div className="border-t flex flex-col">
        <HeroItem
          name="Murphy Lighting Systems"
          subtitle="ETC Paradigm, Mosaic, & Cueserver 3."
          number="'26"
        />
        <HeroItem
          name="Illuminated Integration"
          subtitle="Q-Sys Plugin Development, Cisco Networking."
          number="'25"
        />
        <HeroItem
          name="UNCSA"
          subtitle="Beckhoff PLC Systems, ETC EOS, Grandma3."
          number="'23-'27"
        />
        <HeroItem
          name="Side Projects"
          subtitle="Website/App Development, Overcomplicating Things."
          number="∞"
        />
      </div>
    </div>
  );
}
