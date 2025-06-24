import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";

const cardItems: iCardItem[] = [
  {
    title: "Photona 2024",
    description: "MA3 Programmer",
    tag: "prog",
    src: "/assets/photona24/photona24-1.jpeg",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Fairview",
    description: "Assistant Lighting Designer",
    src: "/assets/fairview/fairview-1.jpeg",
    tag: "ald",
    link: "#",
    color: "green",
    textColor: "white",
  },
  {
    title: "ACT Programming Contest 2024",
    description: "Prize Winner",
    src: "/assets/atcprog24/atcprog-1.png",
    tag: "adventure",
    link: "#",
    color: "white",
    textColor: "white",
  },
  {
    title: "Bandit Lites",
    description: "Summer Apprentace & Integration Tech 2024",
    src: "/assets/bandit/bandit-4.jpg",
    tag: "mountains",
    link: "#",
    color: "white",
    textColor: "white",
  },
];

const Gallery = () => {
  return <CardsParallax items={cardItems} />;
};

export { Gallery };
