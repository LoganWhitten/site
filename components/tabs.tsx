'use client'

import {
  Mail,
  Home,
  Image,
  List,
  Music,
} from "lucide-react";
import { ExpandableTabs, TabItem } from "@/components/ui/expandable-tabs";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allTabs: TabItem[] = [
    { title: "Home", icon: Home },
    { title: "Contact", icon: Mail },
    { type: "separator" },
    { title: "WerkOrder", icon: List },
    { title: "SVGenius", icon: Image },
    { title: "PointCue", icon: Music },
  ];

  const allRoutes = ["/", "/contact", null, "/wo", "/svgenius", "/pointcue"];

  const tabs = isMobile ? allTabs.slice(0, 2) : allTabs;
  const routes = isMobile ? allRoutes.slice(0, 2) : allRoutes;

  const activeIndex = routes.findIndex(route => route && pathname === route);

  useEffect(() => {
    routes.forEach(route => {
      if (route) router.prefetch(route);
    });
  }, [router, routes]);

  const handleTabChange = (index: number | null) => {
    if (index !== null && routes[index] && routes[index] !== pathname) {
      router.push(routes[index]!);
    }
  };

  return (
    <div className="flex no-print flex-col gap-4">
      <ExpandableTabs
        tabs={tabs}
        activeColor="text-blue-500"
        className="border-blue-200 dark:border-blue-800"
        activeIndex={activeIndex}
        onChange={handleTabChange}
      />
    </div>
  );
}

export { TabBar };
