import { formatIcsDate } from "./utils";

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

const DEFAULT_CHECKLIST = [
  "Sunglasses",
  "Sunscreen",
  "Earplugs",
  "Hat",
  "Snacks",
  "Water bottle",
  "Comfortable shoes",
  "Lawn chairs / blankets",
  "Cash",
  "Camera",
];

function buildDescription(race: Race): string {
  const lines: string[] = [];

  lines.push("=== JOSH'S RACE SCHEDULE ===");
  for (const r of race.myRaces) {
    lines.push(`- ${r.name}: ~${r.estimatedTime}`);
  }

  lines.push("");
  lines.push("=== WEEKEND ITINERARY ===");
  const sorted = [...race.itinerary].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  for (const item of sorted) {
    lines.push(`${item.time} - ${item.title}${item.description ? `: ${item.description}` : ""}`);
  }

  lines.push("");
  lines.push("=== WHAT TO BRING ===");
  const checklist = race.checklistItems ?? DEFAULT_CHECKLIST;
  for (const item of checklist) {
    lines.push(`- ${item}`);
  }

  if (race.gateInfo) {
    lines.push("");
    lines.push("=== GETTING THERE ===");
    lines.push(race.gateInfo);
  }

  if (race.notes) {
    lines.push("");
    lines.push("=== TRACK NOTES ===");
    lines.push(race.notes);
  }

  return lines.join("\n");
}

export function generateGoogleCalendarUrl(race: Race): string {
  const text = encodeURIComponent(`${race.trackName} Race Weekend`);
  const location = encodeURIComponent(race.trackLocation);
  const details = encodeURIComponent(buildDescription(race));

  // Format dates for Google Calendar: YYYYMMDDTHHMMSSZ
  const startDate = formatIcsDate(race.dates.start);
  const endDate = formatIcsDate(race.dates.end);
  const dates = encodeURIComponent(`${startDate}/${endDate}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}`;
}

export function generateIcsFile(race: Race): string {
  const description = buildDescription(race)
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

  const uid = `addison-racing-${race.trackName.replace(/\s+/g, "-").toLowerCase()}-${race.dates.start}@addisonracing.app`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Addison Racing//Race Day HQ//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(Date.now())}`,
    `DTSTART:${formatIcsDate(race.dates.start)}`,
    `DTEND:${formatIcsDate(race.dates.end)}`,
    `SUMMARY:${race.trackName} Race Weekend`,
    `LOCATION:${race.trackLocation}`,
    `DESCRIPTION:${description}`,
    "STATUS:CONFIRMED",
    // Day-before reminder alarm
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Race day tomorrow - ${race.trackName}! Don't forget your gear.`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function downloadIcsFile(race: Race): void {
  const content = generateIcsFile(race);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${race.trackName.replace(/\s+/g, "-")}-Race-Weekend.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
