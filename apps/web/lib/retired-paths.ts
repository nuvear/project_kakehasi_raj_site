export const GATE_PATH = "/en/apps/ai-transformation-command-center";
// Same paths are configured at the Firebase edge; these cover direct Cloud Run access.
export const retiredRedirects = [
  { source: "/apps/ai-transformation-command-center/:path*", destination: GATE_PATH, permanent: true },
  { source: "/:locale(en|ja)/frameworks/enterprise-ai-transformation", destination: "/:locale/apps/ai-transformation-command-center", permanent: true },
  { source: "/:locale(en|ja)/apps/ai-transformation-command-center/docs/deployment", destination: "/:locale/apps/ai-transformation-command-center", permanent: true },
  { source: "/:locale(en|ja)/apps/to-do-list", destination: "/:locale/insights", permanent: true },
  { source: "/framework.html", destination: GATE_PATH, permanent: true },
  { source: "/ai-transformation-command-center.html", destination: GATE_PATH, permanent: true },
  { source: "/deployment-guide.html", destination: GATE_PATH, permanent: true },
  { source: "/enterprise-ai-reference-guide.html", destination: "/en/insights/enterprise-ai-reference-guide", permanent: true },
  { source: "/blogs", destination: "/en/insights", permanent: true },
  { source: "/blogs.html", destination: "/en/insights", permanent: true },
];
