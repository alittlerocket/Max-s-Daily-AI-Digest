/**
 * @abstract Fills the {{notes}} and {{questions}} placeholders of a prompt template.
 * @param template The prompt template containing the placeholders.
 * @param notes The day's notes.
 * @param questions The questions extracted from the notes.
 * @returns The finished prompt text.
 * @throws Nothing.
 */
export function buildPrompt(template: string, notes: string, questions: string[]): string {
  const questionList = questions.length > 0 ? questions.map((q) => `- ${q}`).join("\n") : "(none)";
  return template.replace("{{notes}}", () => notes).replace("{{questions}}", () => questionList);
}
