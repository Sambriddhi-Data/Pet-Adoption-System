import { getUserStats } from "@/actions/getUserStats";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getUserStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
