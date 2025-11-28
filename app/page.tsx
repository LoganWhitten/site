import { SplashCursor } from "@/components/ui/splash-cursor";

export default function Page() {
  return (
    <div className="h-full inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-difference text-white">
      <h1 className="font-serif lg:text-8xl flex-col gap-2 flex absolute z-10">
        <span className="italic lg:text-8xl text-6xl tracking-tight">
          Logan Whitten
        </span>
        <span className="text-md lg:text-2xl">
          Lighting Technician & Developer • UNCSA &apos;27
        </span>
      </h1>
      <SplashCursor />
    </div>
  );
}
