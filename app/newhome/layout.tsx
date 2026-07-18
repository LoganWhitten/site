import HeroFooter from "./HeroFooter";
import HeroHeader from "./HeroHeader";

export default function Layout({children}: {children: React.ReactNode}){
    return(
        <div className="dark bg-black">
            <HeroHeader />
            <div className="pt-5 grid place-content-center">
            {children}
            </div>
            <HeroFooter />
        </div>
    )
}