import { NextResponse } from "next/server";
import { getSubjectsFromFS } from "@/lib/content-registry";

export async function GET() {
  const subjects = await getSubjectsFromFS();
  return NextResponse.json(subjects);
}
