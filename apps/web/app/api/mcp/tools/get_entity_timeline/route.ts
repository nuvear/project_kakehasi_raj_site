import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";
import { EducationMetadata, ExperienceMetadata, VentureMetadata } from "@kakehashi/content-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, locale = "en" } = body;

    const db = await getDatabase();
    let entities = [];

    if (id) {
      const entity = await db.getEntity(id);
      if (entity) {
        entities.push(entity);
      }
    } else {
      entities = await db.listEntities();
    }

    const timelineEvents = [];

    for (const entity of entities) {
      // Check if entity has timeline capabilities
      const hasTimeline = 
        entity.type === "education" || 
        entity.type === "experience" || 
        entity.type === "venture";

      if (!hasTimeline) continue;

      const translation = await db.getTranslation(entity.id, locale);
      const title = translation?.frontmatter?.title || entity.id;
      const description = translation?.frontmatter?.summary || "";

      let startDate = "";
      let endDate: string | null = null;
      let orgName = "";
      let detailName = "";

      if (entity.type === "education") {
        const edu = entity as unknown as EducationMetadata;
        startDate = edu.start_date || "";
        endDate = edu.end_date || null;
        orgName = edu.institution?.official_name || "";
        detailName = edu.programme?.official_name || "";
      } else if (entity.type === "experience") {
        const exp = entity as unknown as ExperienceMetadata;
        startDate = exp.start_date || "";
        endDate = exp.end_date || null;
        orgName = exp.company?.official_name || "";
        detailName = exp.role || "";
      } else if (entity.type === "venture") {
        const ven = entity as unknown as VentureMetadata;
        startDate = ven.start_date || "";
        endDate = ven.end_date || null;
        orgName = ven.company_name || "";
        detailName = ven.role || "";
      }

      timelineEvents.push({
        entity_id: entity.id,
        title,
        start_date: startDate,
        end_date: endDate,
        type: entity.type,
        org_name: orgName,
        detail_name: detailName,
        description
      });
    }

    // Sort by start_date descending
    timelineEvents.sort((a, b) => b.start_date.localeCompare(a.start_date));

    return NextResponse.json(timelineEvents);
  } catch (error) {
    console.error("get_entity_timeline error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
