import { OpenRouterClient } from "./openRouterClient";
import { DailyNotes } from "./dailyNotes";
import { stripDigest, withDigest } from "./digestBlock";
import { buildPrompt } from "./prompt";
import { extractQuestions } from "./questions";
import { Settings } from "./settings";

// Generates the digest for one day's note and writes it back into that note.
export class DigestService {
  /**
   * @abstract Stores the note access and settings supplier used for digests.
   * @param notes Access to the daily note files.
   * @param getSettings Returns the current settings.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(
    private notes: DailyNotes,
    private getSettings: () => Settings,
  ) {}

  /**
   * @abstract Sends the day's notes to the language model and writes the reply into the same note.
   * @param date The day to digest in YYYY-MM-DD format.
   * @returns False if the day has no notes to summarize, true once the digest is written.
   * @throws If reading the note, calling the OpenRouter API, or writing the note fails.
   */
  async run(date: string): Promise<boolean> {
    const content = await this.notes.read(date);
    const userNotes = content ? stripDigest(content).trim() : "";
    if (userNotes === "") {
      return false;
    }

    const settings = this.getSettings();
    const prompt = buildPrompt(settings.promptTemplate, userNotes, extractQuestions(userNotes));
    const reply = await new OpenRouterClient(settings.apiKey, settings.model).ask(prompt);

    await this.notes.write(date, withDigest(content ?? "", reply));
    return true;
  }
}
