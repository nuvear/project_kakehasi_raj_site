import { expect, test, describe } from "vitest";
import { UIPlanSchema } from "./ui-schema.js";

describe("UIPlanSchema validation", () => {
  test("accepts a fully valid UI plan (positive case)", () => {
    const validPlan = {
      schemaVersion: "1.0",
      surface: "profile-page",
      locale: "en",
      entityId: "profile.raj",
      title: "Rajkumar Rajagobalan - Profile",
      components: [
        {
          id: "hero-1",
          type: "ProfileHero",
          title: "Rajkumar Rajagobalan",
          content: "Welcome to my portfolio",
          props: {
            imagePath: "/images/raj.jpg"
          }
        },
        {
          id: "timeline-1",
          type: "Timeline",
          title: "Career History",
          props: {
            showDetails: true
          }
        },
        {
          id: "sources-1",
          type: "SourcePanel",
          title: "Sources",
          props: {}
        }
      ],
      sources: ["source-1", "source-2"],
      cachePolicy: {
        scope: "public",
        maxAgeSeconds: 3600
      }
    };

    const parsed = UIPlanSchema.parse(validPlan);
    expect(parsed.surface).toBe("profile-page");
    expect(parsed.locale).toBe("en");
    expect(parsed.components.length).toBe(3);
    expect(parsed.components[0].type).toBe("ProfileHero");
    expect(parsed.cachePolicy?.scope).toBe("public");
  });

  test("accepts custom component types outside the enum fallback", () => {
    const planWithCustomComponent = {
      surface: "dashboard",
      locale: "ja",
      title: "Custom Component Test",
      components: [
        {
          id: "custom-1",
          type: "SomeNewExperimentalWidget",
          title: "Experiment",
          props: {
            color: "blue"
          }
        }
      ],
      sources: []
    };

    const parsed = UIPlanSchema.parse(planWithCustomComponent);
    expect(parsed.components[0].type).toBe("SomeNewExperimentalWidget");
  });

  test("fails closed on missing top-level mandatory fields (negative case)", () => {
    const invalidPlan = {
      // missing surface
      locale: "en",
      title: "Missing Surface",
      components: []
    };

    const result = UIPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path.includes("surface"))).toBe(true);
    }
  });

  test("fails closed on missing component mandatory fields (negative case)", () => {
    const planWithInvalidComponent = {
      surface: "profile",
      locale: "en",
      title: "Invalid Component Fields",
      components: [
        {
          // missing id and type
          title: "Missing Fields Component"
        }
      ]
    };

    const result = UIPlanSchema.safeParse(planWithInvalidComponent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path.includes("components"))).toBe(true);
    }
  });

  test("fails closed on invalid locale (negative case)", () => {
    const planWithInvalidLocale = {
      surface: "profile",
      locale: "fr", // French is not in ["en", "ja"]
      title: "French UI Plan",
      components: []
    };

    const result = UIPlanSchema.safeParse(planWithInvalidLocale);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path.includes("locale"))).toBe(true);
    }
  });

  test("fails closed on invalid cache policy (negative case)", () => {
    const planWithInvalidCache = {
      surface: "profile",
      locale: "en",
      title: "Invalid Cache Policy",
      components: [],
      cachePolicy: {
        scope: "shared", // invalid scope
        maxAgeSeconds: "not-a-number" // invalid maxAgeSeconds
      }
    };

    const result = UIPlanSchema.safeParse(planWithInvalidCache);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path.includes("cachePolicy"))).toBe(true);
    }
  });
});
