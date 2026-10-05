export const housingDeadline = "2026-10-12";
export function housingDeadlinePassed(now = new Date()): boolean {
  return now.getTime() >= new Date("2026-10-13T00:00:00+03:00").getTime();
}
