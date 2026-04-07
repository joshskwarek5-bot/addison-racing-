"use client";

import { useState } from "react";
import { Sun, Droplets, Ear, HardHat, Apple, GlassWater, Footprints, Armchair, Banknote, Camera, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sunglasses: Sun,
  sunscreen: Droplets,
  earplugs: Ear,
  hat: HardHat,
  snacks: Apple,
  "water bottle": GlassWater,
  "comfortable shoes": Footprints,
  "lawn chairs / blankets": Armchair,
  cash: Banknote,
  camera: Camera,
};

function getIcon(item: string) {
  const key = item.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Package;
}

interface ChecklistCardProps {
  items: string[];
  interactive?: boolean;
  className?: string;
}

export function ChecklistCard({ items, interactive = true, className }: ChecklistCardProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(item: string) {
    if (!interactive) return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  const allChecked = items.every((i) => checked.has(i));

  return (
    <div className={cn("space-y-2", className)}>
      {interactive && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#6B6B7E] uppercase tracking-wider">
            {checked.size}/{items.length} packed
          </span>
          {allChecked && (
            <span className="text-xs text-[#00E87A] font-medium">Ready to roll!</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = getIcon(item);
          const isChecked = checked.has(item);

          return (
            <button
              key={item}
              onClick={() => toggle(item)}
              disabled={!interactive}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left w-full",
                interactive && "cursor-pointer hover:border-white/15",
                isChecked
                  ? "bg-[#00E87A]/8 border-[#00E87A]/25 text-[#00E87A]"
                  : "bg-[#0a0a0f] border-white/8 text-[#F0F0F5]",
                !interactive && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  isChecked ? "bg-[#00E87A] border-[#00E87A]" : "border-white/20"
                )}
              >
                {isChecked && (
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <Icon className={cn("w-4 h-4 flex-shrink-0", isChecked ? "text-[#00E87A]" : "text-[#6B6B7E]")} />
              <span className={cn("text-sm font-medium", isChecked && "line-through opacity-70")}>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
