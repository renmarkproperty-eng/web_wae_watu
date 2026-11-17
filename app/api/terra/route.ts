import { NextResponse } from "next/server";
import { getWaeWatuPropertyData } from "@/lib/terra";

export async function GET() {
  const data = await getWaeWatuPropertyData();
  if (!data) {
    return NextResponse.json(
      { status: "error", message: "Failed to connect to Terra PMS" },
      { status: 502 }
    );
  }

  return NextResponse.json(data);
}
