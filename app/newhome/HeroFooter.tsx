import { Bot, BotOff, Copyright } from "lucide-react";

export default function HeroFooter() {
  return (
    <div className="fixed bottom-0 bg-black/20 backdrop-blur-xs w-screen place-content-around md:place-content-center text-center flex place-items-center">
      <p className="flex pr-3 place-items-center">
        <Copyright className="h-3" /> 2026 Logan Whitten
        </p>
        |
        <p className="flex place-items-center">
      <BotOff className="h-4 ml-2" /> all code written by me
        </p>
    </div>
  );
}
