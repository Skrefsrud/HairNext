export function toPostgresInterval(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) {
    throw new Error(`toPostgresInterval received invalid minutes: ${minutes}`);
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Construct the interval string
  let intervalString = "";
  if (hours > 0) {
    intervalString += `${hours} hour${hours !== 1 ? "s" : ""} `;
  }
  if (remainingMinutes > 0) {
    intervalString += `${remainingMinutes} minute${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }

  // If hours and minutes were 0, set interval to '0 minutes'
  return intervalString.trim() || "0 minutes";
}
