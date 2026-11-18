// Matches the "- HH:mm " prefix that the capture box puts on each line.
const LINE_PREFIX = /^-\s*\d{2}:\d{2}\s*/;

/**
 * @abstract Finds every line of the notes that ends in "?".
 * @param notes The day's notes, one entry per line.
 * @returns The question lines with the bullet and timestamp removed.
 * @throws Nothing.
 */
export function extractQuestions(notes: string): string[] {
  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith("?"))
    .map((line) => line.replace(LINE_PREFIX, ""));
}
