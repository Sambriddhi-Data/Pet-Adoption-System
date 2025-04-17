import { getAnimalStatsByMonth } from "@/actions/getAnimalsStats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const year = parseInt(url.searchParams.get("year") || "");
  const month = parseInt(url.searchParams.get("month") || "");

  if (!year || !month) {
    return NextResponse.json({ error: "Missing year or month" }, { status: 400 });
  }

  const stats = await getAnimalStatsByMonth(year, month);
  return NextResponse.json(stats);
}
