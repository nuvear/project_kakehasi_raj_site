import { NextResponse } from "next/server";

// The former unauthenticated GET rewrote production content. Publishing must
// never be triggered by a crawler or an arbitrary visitor following a URL.
export async function GET() {
  return NextResponse.json({ error: "Public content ingestion has been retired." }, {status: 410});
}
