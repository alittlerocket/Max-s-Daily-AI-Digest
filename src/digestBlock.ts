export const DIGEST_START = "<!-- digest:start -->";
export const DIGEST_END = "<!-- digest:end -->";

/**
 * @abstract Removes any existing digest block from the note content.
 * @param content The full note content.
 * @returns The content without the digest block, with trailing whitespace removed.
 * @throws Nothing.
 */
export function stripDigest(content: string): string {
  const start = content.indexOf(DIGEST_START);
  const end = content.indexOf(DIGEST_END);
  if (start === -1 || end === -1 || end < start) {
    return content;
  }
  return (content.slice(0, start) + content.slice(end + DIGEST_END.length)).trimEnd();
}

/**
 * @abstract Replaces the note's digest block with the given text, or appends one if none exists.
 * @param content The full note content.
 * @param digest The digest text to place between the markers.
 * @returns The note content containing the new digest block.
 * @throws Nothing.
 */
export function withDigest(content: string, digest: string): string {
  const block = `${DIGEST_START}\n${digest.trim()}\n${DIGEST_END}`;
  return `${stripDigest(content)}\n\n${block}\n`;
}
