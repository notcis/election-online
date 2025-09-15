"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MainMenu from "./components/main-menu";
import MenuTitle from "./components/menu-title";
import { MenuIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dispatch, SetStateAction, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width:768px)");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="md:grid md:grid-cols-[250px_1fr] h-screen">
      <MainMenu className="hidden md:flex" />
      {!isDesktop && (
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      <div className="overflow-auto py-2 px-4">
        <h1 className="pb-4">Welcome back, Notcis!</h1>
        {children}
      </div>
    </div>
  );
}

type PropsMobile = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen }: PropsMobile) => {
  return (
    <div className="p-4 flex justify-between md:hidden sticky top-0 left-0 bg-background border-b border-border z-20">
      <MenuTitle />
      <Drawer
        direction="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenChange={(open) => setMobileMenuOpen(open)}
      >
        <DrawerTrigger>
          <MenuIcon />
        </DrawerTrigger>
        <DrawerContent>
          <MainMenu />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
