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

describe("Project Kakehashi active migration wave", () => {
  test("keeps only the three enterprise-AI migration items active", () => {
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
          target_en: "/en/frameworks/enterprise-ai-transformation"
        }),
        expect.objectContaining({
          status: "active",
          migration_wave: "7.1",
          target_en: "/en/apps/ai-transformation-command-center"
        }),
        expect.objectContaining({
          status: "active",
          migration_wave: "7.1",
          target_en: "/en/apps/ai-transformation-command-center/docs/deployment"
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

  test("migrates the Enterprise AI Reference Guide from the full legacy markdown source", () => {
    const content = read("content/insights/enterprise-ai-reference-guide/en.md");

    expect(content).toContain("# Enterprise AI Transformation — The Reference Guide");
    expect(content).toContain("# Part I: The Strategic Foundation");
    expect(content).toContain("# Part XXI: Senior Partner's Cheat Sheet");
    expect(content.split("\n").length).toBeGreaterThan(500);
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

  test("restores Framework v8 metadata and deterministic content", () => {
    const entity = yaml.load(
      read("content/frameworks/enterprise-ai-transformation/entity.yaml")
    ) as Record<string, unknown>;
    const content = read("content/frameworks/enterprise-ai-transformation/en.md");
    const route = read("apps/web/app/[locale]/frameworks/[slug]/page.tsx");

    expect(entity.version).toBe("8.0");
    expect(content).toContain("# Enterprise AI Transformation Framework v8");
    expect(content).toContain("## Six Pillars");
    expect(content).toContain("## 12-Week Curriculum");
    expect(content).toContain("## Agent Architecture");
    expect(route).toContain("EnterpriseAIFrameworkInteractive");
    expect(fs.existsSync(path.join(root, "apps/web/components/EnterpriseAIFrameworkInteractive.tsx"))).toBe(true);
  });

  test("keeps Command Center as a localized entry page for the Cloud Run runtime", () => {
    const appContent = read("content/apps/ai-transformation-command-center/en.md");
    const appRoute = "apps/web/app/[locale]/apps/[slug]/page.tsx";
    const docsRoute = "apps/web/app/[locale]/apps/[slug]/docs/deployment/page.tsx";
    const deploymentRoute = read(docsRoute);

    expect(appContent).toContain("## Runtime Boundary");
    expect(appContent).toContain("/apps/ai-transformation-command-center");
    expect(deploymentRoute).toContain("## API Boundary");
    expect(deploymentRoute).toContain("access-control-allow-origin");
    expect(fs.existsSync(path.join(root, appRoute))).toBe(true);
    expect(fs.existsSync(path.join(root, docsRoute))).toBe(true);
  });

  test("configures Firebase so localized app entries stay in Kakehashi and runtime stays on Cloud Run", () => {
    const firebase = JSON.parse(read("firebase.json"));
    const hosting = firebase.hosting.find((target: { target: string }) => target.target === "main");
    const redirects = hosting.redirects as Array<Record<string, string>>;
    const rewrites = hosting.rewrites as Array<Record<string, string | Record<string, string>>>;

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/ai-transformation-command-center.html",
          destination: "/en/apps/ai-transformation-command-center",
          type: 302
        }),
        expect.objectContaining({
          source: "/deployment-guide.html",
          destination: "/en/apps/ai-transformation-command-center/docs/deployment",
          type: 302
        })
      ])
    );

    expect(rewrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/apps/ai-transformation-command-center",
          run: expect.objectContaining({ serviceId: "command-center-web" })
        }),
        expect.objectContaining({
          source: "/apps/ai-transformation-command-center/**",
          run: expect.objectContaining({ serviceId: "command-center-web" })
        })
      ])
    );

    const runtimeRewriteIndex = rewrites.findIndex(
      (rewrite) => rewrite.source === "/apps/ai-transformation-command-center"
    );
    const nestedRuntimeRewriteIndex = rewrites.findIndex(
      (rewrite) => rewrite.source === "/apps/ai-transformation-command-center/**"
    );
    const catchAllRewriteIndex = rewrites.findIndex((rewrite) => rewrite.source === "**");

    expect(runtimeRewriteIndex).toBeGreaterThanOrEqual(0);
    expect(nestedRuntimeRewriteIndex).toBeGreaterThanOrEqual(0);
    expect(catchAllRewriteIndex).toBeGreaterThanOrEqual(0);
    expect(runtimeRewriteIndex).toBeLessThan(catchAllRewriteIndex);
    expect(nestedRuntimeRewriteIndex).toBeLessThan(catchAllRewriteIndex);
    expect(rewrites[catchAllRewriteIndex]).toEqual(
      expect.objectContaining({
        run: expect.objectContaining({ serviceId: "kakehashi-app" })
      })
    );

    expect(
      rewrites.some((rewrite) => String(rewrite.source).startsWith("/*/apps/ai-transformation-command-center"))
    ).toBe(false);
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
    expect(guide?.content_markdown).toContain("Part XXI: Senior Partner's Cheat Sheet");
    expect(framework).toEqual(expect.objectContaining({ version: "8.0" }));
    expect(commandCenter?.content_markdown).toContain("Runtime Boundary");
  });

  test("ingestion can locate bundled content in the standalone runtime image", () => {
    const ingestRoute = read("apps/web/app/api/ingest/route.ts");

    expect(ingestRoute).toContain("process.env.KAKEHASHI_CONTENT_DIR");
    expect(ingestRoute).toContain("apps/web/.next/standalone/content");
    expect(ingestRoute).toContain(".next/standalone/content");
  });
});
