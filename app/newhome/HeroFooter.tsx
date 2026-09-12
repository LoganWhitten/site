import { Bot, Copyright } from "lucide-react";

export default function HeroFooter(){
    return(
        <div className="fixed bottom-0 bg-black/20 backdrop-blur-xs w-screen place-content-center flex place-items-center">
                <Copyright className="h-3" /> 2026 Logan Whitten <Bot className="h-4 ml-2"/> all code written by a human (me)
            </div>
    )
}