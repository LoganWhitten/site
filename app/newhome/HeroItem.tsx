import Link from "next/link";

export default function HeroItem({
  name,
  subtitle,
  number,
}: {
  name: string;
  subtitle: string;
  number: string;
}) {
  return (
<Link href="/newhome/mls">
  <div className="flex p-4 border-b h-36 place-content-between place-items-center hover:text-black hover:bg-white cursor-pointer">
    <div className="flex flex-col">
      <span className="text-6xl">{name}</span>
      <span className="text-xl">{subtitle}</span>
    </div>
    <span className="text-8xl">{number}</span>
  </div>
</Link>
  );
}
