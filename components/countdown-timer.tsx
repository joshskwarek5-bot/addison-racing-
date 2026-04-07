"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetTimestamp: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({ targetTimestamp, className, size = "md" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    function compute() {
      const diff = targetTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (!timeLeft) return null;

  const numClass = cn(
    "font-jetbrains font-bold text-[#FF4D00] tabular-nums leading-none",
    size === "sm" && "text-2xl",
    size === "md" && "text-3xl sm:text-5xl",
    size === "lg" && "text-5xl sm:text-6xl"
  );

  const labelClass = cn(
    "font-outfit text-[#6B6B7E] uppercase tracking-widest",
    size === "sm" && "text-[9px] mt-1",
    size === "md" && "text-[9px] sm:text-[10px] mt-1 sm:mt-1.5",
    size === "lg" && "text-xs mt-2"
  );

  const sepClass = cn(
    "font-jetbrains font-bold text-[#FF4D00]/40 self-start",
    size === "sm" && "text-2xl mt-0",
    size === "md" && "text-3xl sm:text-5xl mt-0",
    size === "lg" && "text-5xl sm:text-6xl mt-0"
  );

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className={cn("text-center", className)}>
        <span className="font-jetbrains text-[#FF4D00] text-2xl font-bold">RACE DAY</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-1.5 sm:gap-4", className)}>
      <div className="flex flex-col items-center">
        <span className={numClass}>{pad(timeLeft.days)}</span>
        <span className={labelClass}>Days</span>
      </div>
      <span className={sepClass}>:</span>
      <div className="flex flex-col items-center">
        <span className={numClass}>{pad(timeLeft.hours)}</span>
        <span className={labelClass}>Hours</span>
      </div>
      <span className={sepClass}>:</span>
      <div className="flex flex-col items-center">
        <span className={numClass}>{pad(timeLeft.minutes)}</span>
        <span className={labelClass}>Min</span>
      </div>
      <span className={sepClass}>:</span>
      <div className="flex flex-col items-center">
        <span className={numClass}>{pad(timeLeft.seconds)}</span>
        <span className={labelClass}>Sec</span>
      </div>
    </div>
  );
}
