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
          title="Design & Production | UNC School of the Arts"
          subtitle="Production Electrician, ETC EOS, Grandma3."
          number="'27"
          gallery={["/images/integration.jpeg"]}
          img="/images/school.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={3}
        >
          <ul className="list-outside list-disc ml-6">
            <li>
              Programmed complex shows utilizing timecode in ETC EOS and
              grandMA3
            </li>
            <li>
              Planned and led teams installing, maintaining, and operating
              lighting equipment and electrical systems for several live
              performances.
            </li>
            <li>
              Served as a lighting designer, contributing to the creative and
              technical design process for productions drafted in Vectorworks
              Spotlight 3d.
            </li>
          </ul>
        </HeroItem>
        <HeroItem
          name="Murphy Lighting Systems"
          gallery={["/images/integration.jpeg"]}
          subtitle="ETC Architectural Systems, Mosaic, & Cueserver 3."
          number="'26"
          title="Lighting Technician Intern"
          img="/images/integration.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={1}
        >
          <ul className="list-outside list-disc ml-6">
            <li>
              Contributed to large-scale themed entertainment projects in
              various stages of the pipeline from early mockup programming to
              on-site installation and commissioning.
            </li>
            <li>
              Designed and programmed lighting architectural interfaces for a
              school and convention center to client’s spec.
            </li>
            <li>
              Tested, assembled, and validated lighting control systems and
              fixtures for theme park attractions and live shows.
            </li>
          </ul>
        </HeroItem>
        <HeroItem
          name="Illuminated Integration"
          title="Systems Integrator Intern"
          gallery={["/images/integration.jpeg"]}
          subtitle="Q-Sys Plugin Development, Cisco Networking."
          number="'25"
          img="/images/coaster.jpg"
          activeTab={activeTab}
          setActive={setActive}
          id={2}
        >
          <ul className="list-outside list-disc ml-6">
            <li>
              Created custom tools utilizing Javascript, and Q-Sys LUA for
              client jobs and internal productivity.
            </li>
            <li>
              Performed quality control and testing of professional lighting
              equipment to ensure performance and reliability.
            </li>
            <li>
              Commissioned and configured ETC Paradigm, Mosaic, Pathway, and
              Q-Sys control systems and equipment.
            </li>
          </ul>
        </HeroItem>
        <HeroItem
          name="Side Projects"
          title="Portfolio Website"
          gallery={["/images/integration.jpeg"]}
          subtitle="Website/App Development, Brand Management."
          number=""
          img="/images/boom.jpeg"
          activeTab={activeTab}
          setActive={setActive}
          id={4}
        >
          <p>

          I programmed this site from scratch, and built a continuous
          integration pipeline to host it on my server at home. Source code available on my <a className=" underline" href="https://github.com/loganwhitten">Github</a>.
          </p>
        </HeroItem>
      </div>
    </div>
  );
}
