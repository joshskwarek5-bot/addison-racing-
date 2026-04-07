import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/utils";

type ItineraryItem = {
  time: string;
  title: string;
  description?: string;
  day: number;
  type: "race" | "practice" | "qualifying" | "social" | "travel" | "other";
};

const TYPE_CONFIG = {
  race:       { color: "bg-[#FF4D00]",   label: "Race",       text: "text-[#FF4D00]",   bg: "bg-[#FF4D00]/10" },
  practice:   { color: "bg-blue-400",    label: "Practice",   text: "text-blue-400",    bg: "bg-blue-400/10" },
  qualifying: { color: "bg-[#FFB800]",   label: "Qualifying", text: "text-[#FFB800]",   bg: "bg-[#FFB800]/10" },
  social:     { color: "bg-[#00E87A]",   label: "Social",     text: "text-[#00E87A]",   bg: "bg-[#00E87A]/10" },
  travel:     { color: "bg-[#6B6B7E]",   label: "Travel",     text: "text-[#6B6B7E]",   bg: "bg-[#6B6B7E]/10" },
  other:      { color: "bg-[#6B6B7E]",   label: "Other",      text: "text-[#6B6B7E]",   bg: "bg-[#6B6B7E]/10" },
};

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  showDayHeaders?: boolean;
  className?: string;
}

export function ItineraryTimeline({ items, showDayHeaders = true, className }: ItineraryTimelineProps) {
  // Group by day
  const days = new Map<number, ItineraryItem[]>();
  for (const item of items) {
    const list = days.get(item.day) ?? [];
    days.set(item.day, [...list, item]);
  }

  // Sort days
  const sortedDays = Array.from(days.entries()).sort(([a], [b]) => a - b);

  return (
    <div className={cn("space-y-6", className)}>
      {sortedDays.map(([day, dayItems], dayIdx) => {
        const sorted = [...dayItems].sort((a, b) => a.time.localeCompare(b.time));

        return (
          <div key={day}>
            {showDayHeaders && sortedDays.length > 1 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs font-jetbrains text-[#6B6B7E] uppercase tracking-wider">
                  {dayIdx === 0 ? "Day 1 - " : `Day ${dayIdx + 1} - `}
                  {formatDateShort(day)}
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
            )}

            <div className="relative space-y-0">
              {/* Vertical line — left: w-16 (time col) + gap-3 = 64+12 = 76px → use left-[4.75rem] */}
              <div className="absolute left-[4.75rem] top-3 bottom-3 w-px bg-white/8" />

              {sorted.map((item, idx) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <div key={idx} className="relative flex gap-3 pb-4 last:pb-0">
                    {/* Time */}
                    <div className="w-16 flex-shrink-0 pt-1">
                      <span className="font-jetbrains text-xs text-[#6B6B7E] whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0 pt-1.5 z-10">
                      <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-[#12121a]", cfg.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-[#F0F0F5]">{item.title}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", cfg.text, cfg.bg)}>
                          {cfg.label}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#6B6B7E] leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
