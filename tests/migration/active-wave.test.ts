import fs from "fs";
import path from "path";
import { describe, expect, test } from "vitest";
import * as yaml from "js-yaml";
import { MockDatabaseProvider } from "../../packages/db/src/mock-db";

const root = path.resolve(__dirname, "../..");

function read(filePath: string) {
  return fs.readFileSync(path.join(root, filePath), "utf-8");
}

function parseFrontmatter(markdown: string) {
  const parts = markdown.split("---");
  if (parts.length < 3) return {};
  return yaml.load(parts[1]) as Record<string, unknown>;
}

function routeBySource(source: string) {
  const manifest = yaml.load(read("migrations/route-manifest.yaml")) as {
    routes: Array<Record<string, string>>;
  };
  return manifest.routes.find((route) => route.source === source);
}

describe("Project Kakehashi public routes and GATE consolidation", () => {
  test("consolidates framework and command center into GATE and retains the guide", () => {
    const activeRoutes = [
      routeBySource("/enterprise-ai-reference-guide.html"),
      routeBySource("/framework.html"),
      routeBySource("/ai-transformation-command-center.html"),
      routeBySource("/deployment-guide.html")
    ];

    expect(activeRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "active",
          migration_wave: "5.5",
          target_en: "/en/insights/enterprise-ai-reference-guide"
        }),
        expect.objectContaining({
          status: "active",
          migration_wave: "6.1",
          target_en: "/en/apps/ai-transformation-command-center"
        }),
        expect.objectContaining({
          status: "active",
          migration_wave: "7.1",
          target_en: "/en/apps/ai-transformation-command-center"
        }),
        expect.objectContaining({
          status: "active",
          migration_wave: "7.1",
          target_en: "/en/apps/ai-transformation-command-center"
        })
      ])
    );

    const deferredSources = [
      "/blood-pressure-app-design.html",
      "/bp.html",
      "/foodie/",
      "healthkitsync.rajagobalan.com",
      "/responsible-ai-governance-adoption.html"
    ];

    for (const source of deferredSources) {
      expect(routeBySource(source)).toEqual(
        expect.objectContaining({
          status: "deferred_current_wave"
        })
      );
    }
  });

  test("preserves the original guide and publishes its reviewed learning replacement", () => {
    const content = read("content/insights/enterprise-ai-reference-guide/en.md");

    expect(content).toContain("# Enterprise AI Transformation — The Reference Guide");
    expect(content).toContain("# Part I: The Strategic Foundation");
    expect(content).toContain("# Part XXI: The Portfolio Review Checklist");
    expect(read("docs/archive/pre-gate-review/reference-guide-en.md")).toContain("# Part XXI: Senior Partner's Cheat Sheet");
    expect(content).toContain("The exercises are fictional");
    expect(content).not.toContain("Zero Hallucination Risk");
  });

  test("marks Japanese active-wave stubs as review_required", () => {
    const files = [
      "content/insights/enterprise-ai-reference-guide/ja.md",
      "content/frameworks/enterprise-ai-transformation/ja.md",
      "content/apps/ai-transformation-command-center/ja.md"
    ];

    for (const file of files) {
      const frontmatter = parseFrontmatter(read(file));
      expect(frontmatter.translation_status).toBe("review_required");
    }
  });

  test("archives the previous framework and retires its interactive demo", () => {
    const entity = yaml.load(read("content/frameworks/enterprise-ai-transformation/entity.yaml")) as Record<string, unknown>;
    expect(entity.publish_status).toBe("archived");
    expect(entity.version).toBe("8.0");
    const route = read("apps/web/app/[locale]/frameworks/[slug]/page.tsx");
    expect(route).toContain("permanentRedirect");
    expect(route).toContain("/apps/ai-transformation-command-center");
    expect(fs.existsSync(path.join(root, "apps/web/components/EnterpriseAIFrameworkInteractive.tsx"))).toBe(false);
  });

  test("positions GATE as the single command center without the demo claims", () => {
    const content = read("content/apps/ai-transformation-command-center/en.md");
    expect(content).toContain("GATE — Governed AI Transformation for Enterprises™");
    expect(content).toContain("https://gate-enterprise.praba.chatgpt.site");
    expect(content).toContain("private owner preview");
    expect(content).not.toContain("Real-time visibility");
    expect(read("apps/web/app/[locale]/apps/[slug]/docs/deployment/page.tsx")).toContain("permanentRedirect");
    expect(fs.existsSync(path.join(root, "apps/web/components/CommandCenterDashboard.tsx"))).toBe(false);
  });

  test("redirects the retired runtime and preserves independent Diary routing", () => {
    const firebase = JSON.parse(read("firebase.json"));
    const hosting = firebase.hosting.find((target: { target: string }) => target.target === "main");
    for (const source of ["/framework.html", "/deployment-guide.html", "/ai-transformation-command-center.html", "/apps/ai-transformation-command-center", "/apps/ai-transformation-command-center/**"]) {
      expect(hosting.redirects).toContainEqual(expect.objectContaining({source, destination: "/en/apps/ai-transformation-command-center", type: 301}));
    }
    expect(hosting.rewrites.map((r: {source: string}) => r.source)).toEqual(["/diary", "/diary/**", "**"]);
    expect(hosting.rewrites[0].run.serviceId).toBe("ai-leadership-diary");
    expect(hosting.rewrites[2].run.serviceId).toBe("kakehashi-app");
    expect(firebase.hosting.find((h: {target: string}) => h.target === "healthkitsync").public).toBe("healthkitsync");
  });

  test("keeps direct runtime paths out of locale middleware and insight pages", () => {
    const middleware = read("apps/web/middleware.ts");
    const insightRoute = read("apps/web/app/[locale]/insights/[slug]/page.tsx");

    expect(middleware).toContain('"/apps/ai-transformation-command-center"');
    expect(middleware).toContain("directRuntimePrefixes.some");
    expect(insightRoute).toContain('listEntities("insight")');
    expect(insightRoute).not.toContain("CommandCenterDashboard");
    expect(insightRoute).not.toContain("listEntities();");
  });

  test("records the legacy Command Center runtime API and CORS contract", () => {
    const contract = read("docs/command-center-runtime-contract.md");
    const currentScope = read("docs/current-migration-scope.md");
    const onboarding = read("ARCHITECT_ONBOARDING.md");
    const legacyNextConfig = read("rajagobalan-site-main/apps/enterprise-ai-platform/frontend/next.config.js");
    const legacyApiClient = read("rajagobalan-site-main/apps/enterprise-ai-platform/frontend/src/utils/api.js");
    const legacyBackendConfig = read("rajagobalan-site-main/apps/enterprise-ai-platform/backend/app/config.py");
    const legacyCompose = read("rajagobalan-site-main/apps/enterprise-ai-platform/docker-compose.yml");

    expect(contract).toContain("Direct Browser-to-Backend");
    expect(contract).toContain("CORS_ORIGINS=https://www.rajagobalan.com");
    expect(contract).toContain("command-center-api-00003-hjb");
    expect(contract).toContain("POST /api/slides/export?company_id={uuid}");
    expect(currentScope).toContain("docs/command-center-runtime-contract.md");
    expect(onboarding).toContain("production frontend origins must be present in `CORS_ORIGINS`");
    expect(legacyNextConfig).toContain("basePath: '/apps/ai-transformation-command-center'");
    expect(legacyApiClient).toContain("NEXT_PUBLIC_API_URL");
    expect(legacyApiClient).toContain("slides/export?company_id=");
    expect(legacyBackendConfig).toContain("CORS_ORIGINS");
    expect(legacyCompose).toContain("PORT: 8000");
  });

  test("mock database reads the filesystem content instead of stale fixtures", async () => {
    const mockDbSource = read("packages/db/src/mock-db.ts");
    const nextConfig = read("apps/web/next.config.ts");
    const webPackage = JSON.parse(read("apps/web/package.json"));
    const dockerfile = read("Dockerfile");
    const dockerIgnore = read(".dockerignore");
    const gcloudIgnore = read(".gcloudignore");
    const db = new MockDatabaseProvider();

    const guide = await db.getTranslation("insight.enterprise-ai-reference-guide", "en");
    const framework = await db.getEntity("framework.enterprise-ai-transformation");
    const commandCenter = await db.getTranslation("app.ai-transformation-command-center", "en");

    expect(mockDbSource).toContain("apps/web/.next/standalone/content");
    expect(nextConfig).toContain("outputFileTracingIncludes");
    expect(nextConfig).toContain("../../content/**/*");
    expect(webPackage.scripts.build).toContain("rm -rf .next/standalone/content");
    expect(webPackage.scripts.build).toContain("cp -R ../../content/. .next/standalone/content/");
    expect(dockerfile).toContain("test -f content/insights/enterprise-ai-reference-guide/en.md");
    expect(dockerfile).toContain("test ! -d content/content");
    expect(dockerfile).not.toContain("COPY --from=builder --chown=nextjs:nodejs /app/content ./content");
    expect(dockerfile).toContain("KAKEHASHI_CONTENT_DIR=/app/content");
    expect(dockerfile).toContain('CMD ["node", "apps/web/server.js"]');
    expect(dockerIgnore).toContain("/docs/");
    expect(dockerIgnore).not.toContain("\ndocs/");
    expect(gcloudIgnore).toContain("/docs/");
    expect(gcloudIgnore).not.toContain("\ndocs/");
    expect(guide?.content_markdown).toContain("Part XXI: The Portfolio Review Checklist");
    expect(framework).toEqual(expect.objectContaining({ version: "8.0" }));
    expect(commandCenter?.content_markdown).toContain("Lead your AI portfolio with evidence.");
  });

  test("public maintenance requests cannot rewrite production content", async () => {
    const { GET } = await import("../../apps/web/app/api/ingest/route");
    const response = await GET();
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({error: "Public content ingestion has been retired."});
  });
});
