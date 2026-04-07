"use client";

import { useRouter } from "next/navigation";
import { MapPin, Calendar, Flag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateRange } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Race = {
  _id: string;
  title: string;
  trackName: string;
  trackLocation: string;
  dates: { start: number; end: number };
  status: "upcoming" | "completed" | "cancelled";
  myRaces: Array<{ name: string }>;
};

interface RaceCardProps {
  race: Race;
  acceptedCount?: number;
  pendingCount?: number;
  className?: string;
  animationDelay?: string;
}

export function RaceCard({ race, acceptedCount = 0, pendingCount = 0, className, animationDelay }: RaceCardProps) {
  const router = useRouter();

  return (
    <Card
      hover
      glow={race.status === "upcoming"}
      className={cn("animate-fade-up cursor-pointer", className)}
      style={animationDelay ? { animationDelay } : undefined}
      onClick={() => router.push(`/races/${race._id}`)}
    >
      {/* Orange top stripe for upcoming */}
      {race.status === "upcoming" && (
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#FF4D00]/40 to-transparent" />
      )}

      <div className="flex items-start justify-between mb-3">
        <Badge status={race.status} />
        <div className="flex items-center gap-1 text-[#6B6B7E] text-xs">
          <Flag className="w-3 h-3" />
          <span className="font-jetbrains">{race.myRaces.length} races</span>
        </div>
      </div>

      <h3 className="font-outfit font-700 text-xl text-[#F0F0F5] leading-tight mb-1">
        {race.trackName}
      </h3>
      <p className="text-[#6B6B7E] text-sm mb-4 line-clamp-1">{race.title}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#6B6B7E]">
          <Calendar className="w-3.5 h-3.5 text-[#FF4D00] flex-shrink-0" />
          <span className="font-jetbrains text-xs text-[#F0F0F5]">
            {formatDateRange(race.dates.start, race.dates.end)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#6B6B7E]">
          <MapPin className="w-3.5 h-3.5 text-[#FF4D00] flex-shrink-0" />
          <span className="text-xs">{race.trackLocation}</span>
        </div>

        {(acceptedCount > 0 || pendingCount > 0) && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-3.5 h-3.5 text-[#FF4D00] flex-shrink-0" />
            <span className="text-xs">
              {acceptedCount > 0 && (
                <span className="text-[#00E87A]">{acceptedCount} going</span>
              )}
              {acceptedCount > 0 && pendingCount > 0 && <span className="text-[#6B6B7E]"> / </span>}
              {pendingCount > 0 && (
                <span className="text-[#FFB800]">{pendingCount} pending</span>
              )}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
