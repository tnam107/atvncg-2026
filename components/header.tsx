"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useIdentity } from "@/components/identity-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/fan-guide", label: "Fan Guide" },
  { href: "/fan-dear", label: "Fan Dear" },
  { href: "/fan-frame", label: "Fan Frame" },
  { href: "/fan-made", label: "Fan Made" },
  { href: "/fan-calls", label: "Fan Calls" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { displayName, openIdentity } = useIdentity();

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-[#fffaf2]/88 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="ATVNCG Fandom - Trang chủ">
          <span className="grid size-9 place-items-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-200 transition group-hover:-rotate-6">
            <Flame size={20} fill="currentColor" />
          </span>
          <span className="text-lg font-black tracking-[-0.04em] text-stone-950">
            ATVNCG<span className="text-orange-600">26</span><span className="ml-1.5 text-[0.62em] tracking-[0.08em] text-stone-700">FANDOM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-bold transition",
                pathname === link.href ? "bg-orange-100 text-orange-800" : "text-stone-600 hover:bg-white hover:text-orange-700",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openIdentity}
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-2 text-sm font-bold text-stone-700 transition hover:border-orange-300 hover:text-orange-700 sm:flex"
          >
            <UserRound size={16} />
            <span className="max-w-28 truncate">{displayName}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-10 cursor-pointer place-items-center rounded-full bg-white text-stone-800 shadow-sm lg:hidden"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-orange-100 bg-[#fffaf2] px-4 pb-5 pt-3 lg:hidden">
          <nav className="container-shell grid gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-stone-700 hover:bg-white">
                {link.label}
              </Link>
            ))}
            <button onClick={() => { setMenuOpen(false); openIdentity(); }} className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl bg-orange-100 px-4 py-3 text-left text-sm font-bold text-orange-800 sm:hidden">
              <UserRound size={16} /> {displayName}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
