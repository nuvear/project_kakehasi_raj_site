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
    const sourceEntity = await db.getEntity(id);

    if (!sourceEntity) {
      return NextResponse.json({ error: `Entity with ID '${id}' not found` }, { status: 404 });
    }

    const allEntities = await db.listEntities();
    // Filter out the source entity itself
    const candidateEntities = allEntities.filter((e) => e.id !== id);

    let related: typeof allEntities = [];

    // Heuristics for relationships
    if (sourceEntity.type === "education") {
      // Related to other education programs, plus main ventures/experience
      related = candidateEntities.filter(
        (e) => e.type === "education" || e.id === "venture.nuvear" || e.id === "experience.capgemini-japan"
      );
    } else if (sourceEntity.type === "venture") {
      // Related to other ventures, plus experience and profile
      related = candidateEntities.filter(
        (e) => e.type === "venture" || e.id === "experience.capgemini-japan" || e.id === "profile.about"
      );
    } else if (sourceEntity.type === "experience") {
      // Related to ventures and other experience/education
      related = candidateEntities.filter(
        (e) => e.type === "experience" || e.type === "venture" || e.id === "education.stanford-executive-program"
      );
    } else {
      // Default: return top 3 entities of other types
      related = candidateEntities.slice(0, 3);
    }

    // Attach translations to make it rich for the orchestrator
    const result = [];
    for (const ent of related) {
      const trans = await db.getTranslation(ent.id, locale);
      result.push({
        ...ent,
        title: trans?.frontmatter?.title || ent.id,
        summary: trans?.frontmatter?.summary || ""
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("get_related_entities error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
