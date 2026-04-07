"use client";

import { Calendar, Download } from "lucide-react";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Race = {
  trackName: string;
  trackLocation: string;
  dates: { start: number; end: number };
  myRaces: Array<{ name: string; estimatedTime: string; day: number }>;
  itinerary: Array<{ time: string; title: string; description?: string; day: number; type: string }>;
  checklistItems?: string[];
  gateInfo?: string;
  notes?: string;
};

interface CalendarExportProps {
  race: Race;
  rsvpId?: Id<"rsvps">;
  onAdded?: () => void;
  className?: string;
}

export function CalendarExport({ race, rsvpId, onAdded, className }: CalendarExportProps) {
  const markCalendarAdded = useMutation(api.rsvps.markCalendarAdded);

  async function handleGoogleCalendar() {
    const url = generateGoogleCalendarUrl(race);
    window.open(url, "_blank", "noopener,noreferrer");
    if (rsvpId) {
      await markCalendarAdded({ id: rsvpId }).catch(() => {});
      onAdded?.();
    }
  }

  async function handleAppleCalendar() {
    downloadIcsFile(race);
    if (rsvpId) {
      await markCalendarAdded({ id: rsvpId }).catch(() => {});
      onAdded?.();
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className ?? ""}`}>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleGoogleCalendar}
        className="flex-1 justify-center"
      >
        <Calendar className="w-4 h-4" />
        Google Calendar
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleAppleCalendar}
        className="flex-1 justify-center"
      >
        <Download className="w-4 h-4" />
        Apple Calendar
      </Button>
    </div>
  );
}
