"use client";

import { cn } from "@/lib/cn";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
];

const PRIORITY_TABS = [
  { value: "all", label: "All" },
  { value: "high", label: "🔴 High" },
  { value: "medium", label: "🟡 Med" },
  { value: "low", label: "🟢 Low" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "due", label: "Due Date" },
];

export function Filters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: FiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search todos..."
          className="glass-input w-full pl-11 pr-4 py-3 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-glass-light rounded-xl p-1 border border-glass-border-light">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                status === tab.value
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex bg-glass-light rounded-xl p-1 border border-glass-border-light">
          {PRIORITY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onPriorityChange(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                priority === tab.value
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="glass-input px-3 py-2 text-xs cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
