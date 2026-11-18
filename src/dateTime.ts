/**
 * @abstract Left-pads a number with zeros to two digits.
 * @param n The number to pad.
 * @returns The number as a string of at least two digits.
 * @throws Nothing.
 */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * @abstract Formats a date as YYYY-MM-DD in local time.
 * @param date The date to format.
 * @returns The formatted date string.
 * @throws Nothing.
 */
export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * @abstract Formats a date as HH:mm (24-hour) in local time.
 * @param date The date to format.
 * @returns The formatted time string.
 * @throws Nothing.
 */
export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * @abstract Converts an "HH:mm" string into minutes since midnight.
 * @param time The time string in "HH:mm" format.
 * @returns Minutes since midnight, or NaN if the string is not in "HH:mm" format.
 * @throws Nothing.
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * @abstract Computes the minutes elapsed since midnight in local time.
 * @param date The date to measure.
 * @returns Minutes since midnight.
 * @throws Nothing.
 */
export function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
