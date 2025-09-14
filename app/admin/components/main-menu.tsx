import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MenuItem from "./menu-item";
import MenuTitle from "./menu-title";

export default function MainMenu({ className }: { className?: string }) {
  return (
    <nav
      className={cn("md:bg-muted overflow-auto p-4 flex flex-col", className)}
    >
      <header className=" hidden md:block border-b dark:border-b-black border-b-zinc-300 pb-4">
        <MenuTitle />
      </header>
      <ul className="py-4 grow">
        <MenuItem href="/admin/e">จัดการเลือกตั้ง</MenuItem>
        <MenuItem href="/admin/c">จัดการผู้สมัคร</MenuItem>
      </ul>
      <footer className="flex items-center gap-2 ">
        <Avatar>
          <AvatarFallback>NC</AvatarFallback>
        </Avatar>
        <Link href="/" className=" hover:underline">
          Logout
        </Link>
      </footer>
    </nav>
  );
}
