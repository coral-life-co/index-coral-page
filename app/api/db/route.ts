import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const measurement = searchParams.get("measurement");

  if (!category || !measurement) {
    return NextResponse.json({ error: "Invalid category or measurement" }, { status: 400 });
  }

  const url = `api/py/local/data/${category}/${measurement}`;
  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json({ error: "Error fetching data" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}