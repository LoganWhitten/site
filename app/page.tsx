"use client";

import { useState } from "react";
import HeroItem from "./newhome/HeroItem";

export default function NewHome() {
  const [activeTab, setActive] = useState(0);
  return (
    <div className="bg-black pt-11 pb-5 w-screen dark">
      <div className="border-t flex flex-col">
        <HeroItem
          name="UNCSA"
          subtitle="Beckhoff Automation Independent Study, ETC EOS, Grandma3."
          number="'27"
          gallery={["/images/integration.jpeg"]}
          img="/images/school.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={3}
        />
        <HeroItem
          name="Murphy Lighting Systems"
          gallery={["/images/integration.jpeg"]}
          subtitle="ETC Architectural Systems, Mosaic, & Cueserver 3."
          number="'26"
          img="/images/integration.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={1}
        />
        <HeroItem
          name="Illuminated Integration"
          gallery={["/images/integration.jpeg"]}
          subtitle="Q-Sys Plugin Development, Cisco Networking."
          number="'25"
          img="/images/integration.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={2}
        />

        <HeroItem
          name="Side Projects"
          gallery={[
            "/images/integration.jpeg",
          ]}
          subtitle="Website/App Development, Brand Management."
          number=""
          img="/images/boom.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={4}
        />
      </div>
    </div>
  );
}
