"use client";

import { cn } from "@/lib/utils";
import { Check, HelpCircle, X, type LucideProps } from "lucide-react";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

type RsvpStatus = "accepted" | "maybe" | "declined";

interface RsvpBadgeProps {
  value: RsvpStatus | null;
  onChange: (status: RsvpStatus) => void;
  disabled?: boolean;
  className?: string;
}

const OPTIONS: Array<{ value: RsvpStatus; label: string; icon: LucideIcon; activeClass: string; inactiveClass: string }> = [
  {
    value: "accepted",
    label: "I'm Coming",
    icon: Check,
    activeClass: "bg-[#00E87A] border-[#00E87A] text-black",
    inactiveClass: "border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10",
  },
  {
    value: "maybe",
    label: "Maybe",
    icon: HelpCircle,
    activeClass: "bg-[#FFB800] border-[#FFB800] text-black",
    inactiveClass: "border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800]/10",
  },
  {
    value: "declined",
    label: "Can't Make It",
    icon: X,
    activeClass: "bg-[#FF3B5C] border-[#FF3B5C] text-white",
    inactiveClass: "border-[#FF3B5C]/30 text-[#FF3B5C] hover:bg-[#FF3B5C]/10",
  },
];

export function RsvpBadge({ value, onChange, disabled, className }: RsvpBadgeProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 min-h-14 px-4 py-3 rounded-xl border-2 font-outfit font-600 text-sm transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isActive ? option.activeClass : option.inactiveClass,
              isActive ? "scale-[1.02] shadow-lg" : "hover:-translate-y-0.5"
            )}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
