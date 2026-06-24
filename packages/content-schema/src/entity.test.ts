import { expect, test } from "vitest";
import { EntityMetadataSchema } from "./entity.js";

test("parses valid education metadata", () => {
  const data = {
    id: "education.test",
    type: "education",
    canonical_slug: "test-edu",
    institution: {
      id: "inst.test",
      official_name: "Test University"
    },
    programme: {
      official_name: "Test Programme"
    },
    start_date: "2025-01",
    end_date: null,
    ui_capabilities: ["institution_hero"]
  };
  const parsed = EntityMetadataSchema.parse(data);
  expect(parsed.id).toBe("education.test");
  expect(parsed.type).toBe("education");
});

test("parses valid experience metadata", () => {
  const data = {
    id: "experience.test",
    type: "experience",
    canonical_slug: "test-exp",
    company: {
      id: "comp.test",
      official_name: "Test Company"
    },
    role: "Software Architect",
    start_date: "2026-01",
    end_date: null
  };
  const parsed = EntityMetadataSchema.parse(data);
  expect(parsed.id).toBe("experience.test");
  expect(parsed.type).toBe("experience");
});

test("parses valid venture metadata", () => {
  const data = {
    id: "venture.test",
    type: "venture",
    canonical_slug: "test-venture",
    company_name: "Test Venture Inc.",
    role: "Founder",
    start_date: "2026-01",
    end_date: null
  };
  const parsed = EntityMetadataSchema.parse(data);
  expect(parsed.id).toBe("venture.test");
  expect(parsed.type).toBe("venture");
});
