import { getDatabase } from "@kakehashi/db";
import { FullTranslation } from "@kakehashi/content-schema";

export interface SEOAuditIssue {
  entityId: string;
  entityType: string;
  locale: "en" | "ja" | "all";
  issueType: string;
  severity: "error" | "warning" | "info";
  details: string;
  fix: string;
}

export async function runMetadataAudit(): Promise<SEOAuditIssue[]> {
  const db = await getDatabase();
  const entities = await db.listEntities();
  const issues: SEOAuditIssue[] = [];
  const now = Date.now();
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;

  for (const entity of entities) {
    const enTrans = await db.getTranslation(entity.id, "en");
    const jaTrans = await db.getTranslation(entity.id, "ja");

    // 1. Check translation coverage
    if (!enTrans) {
      issues.push({
        entityId: entity.id,
        entityType: entity.type,
        locale: "en",
        issueType: "translation_missing",
        severity: "error",
        details: "English translation is missing.",
        fix: "Create en.md translation file."
      });
    }
    if (!jaTrans) {
      issues.push({
        entityId: entity.id,
        entityType: entity.type,
        locale: "ja",
        issueType: "translation_missing",
        severity: "error",
        details: "Japanese translation is missing.",
        fix: "Create ja.md translation file."
      });
    }

    const checkTranslation = (trans: FullTranslation, lang: "en" | "ja") => {
      if (!trans) return;
      const fm = trans.frontmatter;
      const title = fm.title || "";
      const summary = fm.summary || "";
      const reviewDate = fm.last_editorial_review;

      // Title audit
      if (!title) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "title_missing",
          severity: "error",
          details: "Meta title is empty.",
          fix: "Provide a meta title in the frontmatter."
        });
      } else if (title.length > 60) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "title_too_long",
          severity: "warning",
          details: `Meta title is too long (${title.length} chars). Target is <= 60.`,
          fix: "Shorten title to less than 60 characters."
        });
      }

      // Summary / description audit
      if (!summary) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "description_missing",
          severity: "error",
          details: "Meta summary/description is empty.",
          fix: "Provide a summary in the frontmatter."
        });
      } else if (summary.length < 100) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "description_too_short",
          severity: "warning",
          details: `Meta summary is too short (${summary.length} chars). Target is 100-160.`,
          fix: "Elaborate summary to be at least 100 characters."
        });
      } else if (summary.length > 160) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "description_too_long",
          severity: "warning",
          details: `Meta summary is too long (${summary.length} chars). Target is 100-160.`,
          fix: "Trim summary to less than 160 characters."
        });
      }

      // Review date audit
      if (!reviewDate) {
        issues.push({
          entityId: entity.id,
          entityType: entity.type,
          locale: lang,
          issueType: "review_date_missing",
          severity: "warning",
          details: "last_editorial_review is missing from frontmatter.",
          fix: "Add last_editorial_review field with YYYY-MM-DD."
        });
      } else {
        const reviewTime = new Date(reviewDate).getTime();
        if (isNaN(reviewTime)) {
          issues.push({
            entityId: entity.id,
            entityType: entity.type,
            locale: lang,
            issueType: "review_date_invalid",
            severity: "error",
            details: `Invalid last_editorial_review date format: "${reviewDate}"`,
            fix: "Format date as YYYY-MM-DD."
          });
        } else if (now - reviewTime > sixMonthsMs) {
          issues.push({
            entityId: entity.id,
            entityType: entity.type,
            locale: lang,
            issueType: "stale_review",
            severity: "warning",
            details: `Content has not been reviewed since ${reviewDate} (over 6 months ago).`,
            fix: "Perform content review and update last_editorial_review."
          });
        }
      }
    };

    if (enTrans) {
      checkTranslation(enTrans, "en");
    }
    if (jaTrans) {
      checkTranslation(jaTrans, "ja");
    }
  }

  return issues;
}
