import { cn } from "@/lib/utils";

type Status = "accepted" | "declined" | "pending" | "maybe" | "upcoming" | "completed" | "cancelled";

interface BadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  accepted:  { label: "Going",      classes: "bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20" },
  declined:  { label: "Can't Make It", classes: "bg-[#FF3B5C]/10 text-[#FF3B5C] border-[#FF3B5C]/20" },
  pending:   { label: "No Response", classes: "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20" },
  maybe:     { label: "Maybe",       classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  upcoming:  { label: "Upcoming",    classes: "bg-[#FF4D00]/10 text-[#FF4D00] border-[#FF4D00]/20" },
  completed: { label: "Completed",   classes: "bg-white/5 text-[#6B6B7E] border-white/10" },
  cancelled: { label: "Cancelled",   classes: "bg-[#FF3B5C]/10 text-[#FF3B5C] border-[#FF3B5C]/20" },
};

export function Badge({ status, className }: BadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        cfg.classes,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
