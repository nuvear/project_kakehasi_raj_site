import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { entityId } = body;

    if (!entityId) {
      return NextResponse.json({ error: "Parameter 'entityId' is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const mediaCatalog = await db.getMediaCatalog(entityId);

    if (!mediaCatalog) {
      return NextResponse.json({
        entity_id: entityId,
        media: []
      });
    }

    return NextResponse.json(mediaCatalog);
  } catch (error) {
    console.error("get_public_media error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
