"use client";

import { useState, useEffect, useCallback } from "react";
import type { Todo } from "@/lib/schema";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { Filters } from "./Filters";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetchTodos = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (priority !== "all") params.set("priority", priority);
    if (status !== "all") params.set("status", status);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/todos?${params}`);
    const data = await res.json();
    setTodos(data);
  }, [search, priority, status, sort]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) fetchTodos();
  }, [mounted, fetchTodos]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mounted) fetchTodos();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, mounted, fetchTodos]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <TodoForm onAdd={fetchTodos} />
      <Filters
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{activeCount} active</span>
        <span className="w-px h-3 bg-slate-700" />
        <span>{completedCount} completed</span>
        <span className="w-px h-3 bg-slate-700" />
        <span>{todos.length} total</span>
      </div>
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-slate-400 text-sm">No todos yet. Add one above!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))
        )}
      </div>
    </div>
  );
}
