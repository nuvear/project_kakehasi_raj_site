import { expect, test, describe, beforeAll } from "vitest";
import { POST as agentPOST } from "../../apps/web/app/api/agent/route.ts";
import { runMetadataAudit } from "../../apps/web/lib/seo-scanner";
import { UIPlanSchema } from "../../packages/content-schema/src/ui-schema";
import { NextRequest } from "next/server";

beforeAll(() => {
  process.env.MOCK_DB = "true";
});

describe("Phase 9 SEO & Editorial Advisor — Programmatic Scanner", () => {
  test("runMetadataAudit successfully scans and retrieves issues", async () => {
    const issues = await runMetadataAudit();
    expect(Array.isArray(issues)).toBe(true);

    // If there are issues, check their shape
    if (issues.length > 0) {
      const firstIssue = issues[0];
      expect(firstIssue).toHaveProperty("entityId");
      expect(firstIssue).toHaveProperty("entityType");
      expect(firstIssue).toHaveProperty("locale");
      expect(firstIssue).toHaveProperty("issueType");
      expect(firstIssue).toHaveProperty("severity");
      expect(firstIssue).toHaveProperty("details");
      expect(firstIssue).toHaveProperty("fix");
      expect(["error", "warning", "info"]).toContain(firstIssue.severity);
      expect(["en", "ja", "all"]).toContain(firstIssue.locale);
    }
  });
});

describe("Phase 9 SEO & Editorial Advisor — Agent Orchestrator Mock Mode", () => {
  test("returns SEOAuditReport plan when query contains 'seo audit'", async () => {
    const req = new NextRequest("http://localhost/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Run an SEO audit of our portfolio" }
        ],
        locale: "en"
      })
    });

    const res = await agentPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("mock");
    expect(data.uiPlan).toBeDefined();

    // Verify against UIPlan Zod schema
    const validation = UIPlanSchema.safeParse(data.uiPlan);
    expect(validation.success).toBe(true);
    
    // Specific component check
    const plan = data.uiPlan;
    expect(plan.components.length).toBeGreaterThan(0);
    const hasAuditReport = plan.components.some((c: any) => c.type === "SEOAuditReport");
    expect(hasAuditReport).toBe(true);
  });

  test("returns ArticleBrief plan when query contains 'article brief'", async () => {
    const req = new NextRequest("http://localhost/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Write a brief for Enterprise AI article" }
        ],
        locale: "ja"
      })
    });

    const res = await agentPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("mock");
    expect(data.uiPlan).toBeDefined();

    // Verify against UIPlan Zod schema
    const validation = UIPlanSchema.safeParse(data.uiPlan);
    expect(validation.success).toBe(true);

    const plan = data.uiPlan;
    expect(plan.locale).toBe("ja");
    expect(plan.components.length).toBeGreaterThan(0);
    const hasBrief = plan.components.some((c: any) => c.type === "ArticleBrief");
    expect(hasBrief).toBe(true);
  });

  test("agent routes respect locale settings", async () => {
    const req = new NextRequest("http://localhost/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "brief for digital transformation" }
        ],
        locale: "ja"
      })
    });

    const res = await agentPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.uiPlan.locale).toBe("ja");
  });
});
