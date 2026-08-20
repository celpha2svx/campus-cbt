import { NextResponse } from "next/server";
import questionsData from "@/data/questions.json";

export function GET() {
  const ids = (questionsData as { id: string }[]).map((q) => q.id);
  return NextResponse.json({ ids });
}
