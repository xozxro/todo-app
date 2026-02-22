"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Priority = "low" | "medium" | "high";

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "medium", label: "Med", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "high", label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

interface TodoFormProps {
  onAdd: () => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          dueDate: dueDate || undefined,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setExpanded(false);
        onAdd();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-glass border border-glass-border rounded-2xl p-5 backdrop-blur-xl glass-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="What needs to be done?"
            className="glass-input flex-1 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className={cn(
              "px-5 py-3 rounded-xl text-sm font-medium transition-all",
              "bg-accent hover:bg-accent-hover text-white",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "shadow-lg shadow-accent/20"
            )}
          >
            {loading ? "..." : "Add"}
          </button>
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={2}
              className="glass-input w-full px-4 py-3 text-sm resize-none"
            />

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Priority:</span>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                        priority === p.value
                          ? p.color
                          : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Due:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="glass-input px-3 py-1 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
