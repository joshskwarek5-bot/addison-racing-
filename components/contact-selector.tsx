"use client";

import { useState } from "react";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Contact = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  relationship?: string;
  tags?: string[];
};

interface ContactSelectorProps {
  contacts: Contact[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  className?: string;
}

export function ContactSelector({ contacts, selected, onToggle, className }: ContactSelectorProps) {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags ?? []))).sort();

  const filtered = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesTag = !tagFilter || (c.tags ?? []).includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  function selectAll() {
    filtered.forEach((c) => {
      if (!selected.has(c._id)) onToggle(c._id);
    });
  }

  function deselectAll() {
    filtered.forEach((c) => {
      if (selected.has(c._id)) onToggle(c._id);
    });
  }

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c._id));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7E]" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0F0F5] placeholder:text-[#6B6B7E] focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors"
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTagFilter(null)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-all",
              !tagFilter
                ? "bg-[#FF4D00]/15 border-[#FF4D00]/30 text-[#FF4D00]"
                : "border-white/10 text-[#6B6B7E] hover:border-white/20"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize",
                tagFilter === tag
                  ? "bg-[#FF4D00]/15 border-[#FF4D00]/30 text-[#FF4D00]"
                  : "border-white/10 text-[#6B6B7E] hover:border-white/20"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between text-xs text-[#6B6B7E]">
        <span>{selected.size} selected</span>
        <div className="flex gap-3">
          <button onClick={selectAll} className="hover:text-[#F0F0F5] transition-colors">
            Select all
          </button>
          <button onClick={deselectAll} className="hover:text-[#F0F0F5] transition-colors">
            Deselect all
          </button>
        </div>
      </div>

      {/* Contact list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.map((contact) => {
          const isSelected = selected.has(contact._id);
          return (
            <button
              key={contact._id}
              onClick={() => onToggle(contact._id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                isSelected
                  ? "bg-[#FF4D00]/8 border-[#FF4D00]/25"
                  : "bg-[#0a0a0f] border-white/8 hover:border-white/15"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  isSelected ? "bg-[#FF4D00] border-[#FF4D00]" : "border-white/20"
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#F0F0F5]">{contact.name}</span>
                  {contact.relationship && (
                    <span className="text-xs text-[#6B6B7E]">{contact.relationship}</span>
                  )}
                </div>
                {contact.email && (
                  <p className="text-xs text-[#6B6B7E] truncate">{contact.email}</p>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="flex gap-1 flex-shrink-0">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#6B6B7E] capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-[#6B6B7E] text-sm py-8">No contacts found</p>
        )}
      </div>
    </div>
  );
}
