"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/races", label: "Races", icon: Flag },
  ];

  return (
    <nav className="relative z-10 border-b border-white/6 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#ff6a20] flex items-center justify-center">
              <Flag className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-outfit font-700 text-[#F0F0F5] tracking-tight text-sm hidden sm:block">Addison Racing</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 ml-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                    active
                      ? "bg-[#FF4D00]/10 text-[#FF4D00]"
                      : "text-[#6B6B7E] hover:text-[#F0F0F5] hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
