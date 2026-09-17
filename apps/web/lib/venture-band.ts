export function isCurrentVenture(endDate: string | null | undefined): boolean {
  return endDate == null || endDate === "";
}

export function ventureStatusLabel(
  endDate: string | null | undefined,
  locale: string,
): string {
  if (locale === "ja") {
    return isCurrentVenture(endDate) ? "現在" : "以前";
  }
  return isCurrentVenture(endDate) ? "Current" : "Earlier";
}

export function ventureBandEyebrow({
  role,
  endDate,
  period,
  locale,
}: {
  role?: string;
  endDate?: string | null;
  period: string;
  locale: string;
}): string {
  return [ventureStatusLabel(endDate, locale), role, period]
    .filter(Boolean)
    .join(" · ");
}
