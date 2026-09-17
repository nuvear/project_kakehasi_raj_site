import { describe, expect, test } from "vitest";
import { formatDateRange } from "../../apps/web/lib/date-format";
import {
  isCurrentVenture,
  ventureBandEyebrow,
  ventureStatusLabel,
} from "../../apps/web/lib/venture-band";

describe("venture band status", () => {
  test("treats a missing end date as current", () => {
    expect(isCurrentVenture(null)).toBe(true);
    expect(isCurrentVenture(undefined)).toBe(true);
    expect(isCurrentVenture("2020-02")).toBe(false);
    expect(ventureStatusLabel(null, "en")).toBe("Current");
    expect(ventureStatusLabel("2020-02", "ja")).toBe("以前");
  });

  test("matches operator roles and dates on the home eyebrow", () => {
    expect(
      ventureBandEyebrow({
        locale: "en",
        role: "Founder",
        endDate: null,
        period: formatDateRange("2025-10", null, "en"),
      }),
    ).toBe("Current · Founder · Oct 2025 to Present");

    expect(
      ventureBandEyebrow({
        locale: "en",
        role: "CEO and Founder",
        endDate: null,
        period: formatDateRange("2026-08", null, "en"),
      }),
    ).toBe("Current · CEO and Founder · Aug 2026 to Present");

    expect(
      ventureBandEyebrow({
        locale: "en",
        role: "Co-Founder & Director",
        endDate: "2020-02",
        period: formatDateRange("2011-09", "2020-02", "en"),
      }),
    ).toBe("Earlier · Co-Founder & Director · Sep 2011 to Feb 2020");

    expect(
      ventureBandEyebrow({
        locale: "ja",
        role: "Founder",
        endDate: null,
        period: formatDateRange("2025-10", null, "ja"),
      }),
    ).toBe("現在 · Founder · 2025年10月〜現在");
  });
});
