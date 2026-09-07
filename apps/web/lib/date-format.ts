export function formatMonthDate(date: string | null | undefined, locale: string) {
  if (!date) {
    return null;
  }

  const [year, month] = date.split("-");
  const monthNumber = Number.parseInt(month, 10);

  if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
    return date;
  }

  if (locale === "ja") {
    return `${year}年${monthNumber}月`;
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[monthNumber - 1]} ${year}`;
}

export function formatDateRange(startDate: string | null | undefined, endDate: string | null | undefined, locale: string) {
  const start = formatMonthDate(startDate, locale);
  const end = endDate ? formatMonthDate(endDate, locale) : locale === "ja" ? "現在" : "Present";

  if (!start) {
    return end;
  }

  return locale === "ja" ? `${start}〜${end}` : `${start} to ${end}`;
}
