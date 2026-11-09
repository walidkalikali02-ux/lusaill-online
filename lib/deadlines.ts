export const housingDeadline = "2027-01-12";
export const housingDeadlineLabel = "12 يناير 2027";
export const housingDeadlineSource = "https://cabinet.gov.eg/Meeting/Details/11912";
export const housingDeadlineCheckedAt = "2026-11-09";

export function housingDeadlinePassed(now = new Date()): boolean {
  // Compare dates in Egypt; the decision does not specify a closing hour.
  const localDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return localDate > housingDeadline;
}
