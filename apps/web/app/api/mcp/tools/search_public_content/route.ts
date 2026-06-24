import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";
import { getEmbedding } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { query, embedding: inputEmbedding, limit = 3 } = body;

    if (!query && !inputEmbedding) {
      return NextResponse.json(
        { error: "Either 'query' or 'embedding' is required" },
        { status: 400 }
      );
    }

    let embedding = inputEmbedding;
    if (!embedding && query) {
      embedding = await getEmbedding(query);
    }

    const db = await getDatabase();
    const results = await db.searchSimilarContent(embedding, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("search_public_content error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
