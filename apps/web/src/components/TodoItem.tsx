"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Todo } from "@/lib/schema";

const PRIORITY_STYLES = {
  low: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-red-500/20 text-red-400",
} as const;

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  async function toggleComplete() {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    onUpdate();
  }

  async function deleteTodo() {
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    onUpdate();
  }

  async function saveEdit() {
    if (!editTitle.trim()) return;
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim() }),
    });
    setEditing(false);
    onUpdate();
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      setEditTitle(todo.title);
      setEditing(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: `${Math.abs(days)}d overdue`, urgent: true };
    if (days === 0) return { text: "Today", urgent: true };
    if (days === 1) return { text: "Tomorrow", urgent: false };
    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      urgent: false,
    };
  }

  const dueDateInfo = todo.dueDate ? formatDate(todo.dueDate) : null;

  return (
    <div
      className={cn(
        "todo-item group bg-glass border border-glass-border rounded-xl p-4 backdrop-blur-xl",
        "flex items-start gap-4",
        todo.completed && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={toggleComplete}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all flex items-center justify-center",
          todo.completed
            ? "bg-accent border-accent"
            : "border-slate-500 hover:border-accent"
        )}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEdit}
            autoFocus
            className="glass-input w-full px-3 py-1.5 text-sm"
          />
        ) : (
          <p
            onDoubleClick={() => setEditing(true)}
            className={cn(
              "text-sm font-medium text-slate-200 transition-all cursor-pointer",
              todo.completed && "line-through text-slate-400"
            )}
            title="Double-click to edit"
          >
            {todo.title}
          </p>
        )}
        {todo.description && !editing && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{todo.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider",
              PRIORITY_STYLES[todo.priority],
              todo.priority === "high" && !todo.completed && "priority-high-pulse"
            )}
          >
            {todo.priority}
          </span>

          {dueDateInfo && (
            <span
              className={cn(
                "text-[11px]",
                dueDateInfo.urgent && !todo.completed ? "text-red-400" : "text-slate-500"
              )}
            >
              📅 {dueDateInfo.text}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={deleteTodo}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-danger p-1"
        aria-label="Delete todo"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
