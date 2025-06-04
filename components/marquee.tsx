"use client";

import { FlowingMenu } from "./ui/flowing-menu";

interface DemoItem {
  link: string;
  text: string;
  image: string;
}

interface CategorizedDemoItems {
  category: string;
  items: DemoItem[];
}

export default function Marquee({
  categorizedDemoItems,
}: {
  categorizedDemoItems: CategorizedDemoItems[];
}) {
  return (
    <>
      <style jsx global>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marqueeScroll 25s linear infinite;
        }
      `}</style>

      <div className="flex flex-col w-full justify-center items-center bg-gray-100 dark:bg-neutral-900 p-4 transition-colors duration-300">
        {categorizedDemoItems.map((categoryGroup) => (
          <div key={categoryGroup.category} className="w-full mb-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-neutral-900 dark:text-white">
              {categoryGroup.category}
            </h2>
            <div
              className="relative shadow-xl rounded-lg overflow-hidden h-64 w-full"
            >
              <FlowingMenu items={categoryGroup.items} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
