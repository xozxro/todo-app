import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/lib/schema";
import { like, eq, desc, asc, and, SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const priority = searchParams.get("priority");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "newest";

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(like(todos.title, `%${search}%`));
  }
  if (priority && priority !== "all") {
    conditions.push(eq(todos.priority, priority as "low" | "medium" | "high"));
  }
  if (status === "active") {
    conditions.push(eq(todos.completed, false));
  } else if (status === "completed") {
    conditions.push(eq(todos.completed, true));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const orderBy =
    sort === "oldest"
      ? asc(todos.createdAt)
      : sort === "priority"
        ? desc(todos.priority)
        : sort === "due"
          ? asc(todos.dueDate)
          : desc(todos.createdAt);

  const results = await db
    .select()
    .from(todos)
    .where(where)
    .orderBy(orderBy);

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, priority, dueDate } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const result = await db
    .insert(todos)
    .values({
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
