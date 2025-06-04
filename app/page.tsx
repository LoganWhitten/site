'use'
import Marquee from "@/components/marquee";

export default function Page() {
  const developmentItems = [
    { link: '#dev1', text: 'Dev Item 1', image: 'https://picsum.photos/seed/dev1/600/400' },
    { link: '#dev2', text: 'Dev Item 2', image: 'https://picsum.photos/seed/dev2/600/400' },
  ];
  const designItems = [
    { link: '#design1', text: 'Design Item 1', image: 'https://picsum.photos/seed/design1/600/400' },
    { link: '#design2', text: 'Design Item 2', image: 'https://picsum.photos/seed/design2/600/400' },
  ];
  const integrationItems = [
    { link: '#integ1', text: 'Integration Item 1', image: 'https://picsum.photos/seed/integ1/600/400' },
    { link: '#integ2', text: 'Integration Item 2', image: 'https://picsum.photos/seed/integ2/600/400' },
  ];
  const electricianItems = [
    { link: '#elec1', text: 'Electrician Item 1', image: 'https://picsum.photos/seed/elec1/600/400' },
    { link: '#elec2', text: 'Electrician Item 2', image: 'https://picsum.photos/seed/elec2/600/400' },
  ];

  const categorizedItems = [
    { category: "Development", items: developmentItems },
    { category: "Design", items: designItems },
    { category: "Integration", items: integrationItems },
    { category: "Electrician", items: electricianItems },
  ];
  
  return (
    <div className="h-full w-full">
      <Marquee categorizedDemoItems={categorizedItems} />
    </div>
  );
}
