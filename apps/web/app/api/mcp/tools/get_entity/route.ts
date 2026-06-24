import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, locale = "en" } = body;

    if (!id) {
      return NextResponse.json({ error: "Parameter 'id' is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const entity = await db.getEntity(id);

    if (!entity) {
      return NextResponse.json({ error: `Entity with ID '${id}' not found` }, { status: 404 });
    }

    const translation = await db.getTranslation(id, locale);

    return NextResponse.json({
      entity,
      translation
    });
  } catch (error) {
    console.error("get_entity error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
