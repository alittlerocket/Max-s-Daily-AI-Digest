import { normalizePath, TFile, Vault } from "obsidian";

// Reads and writes the per-day note files inside the log folder.
export class DailyNotes {
  /**
   * @abstract Stores the vault and the function that supplies the log folder.
   * @param vault The Obsidian vault holding the notes.
   * @param getFolder Returns the current log folder path from settings.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(
    private vault: Vault,
    private getFolder: () => string,
  ) {}

  /**
   * @abstract Appends one line to the day's note, creating the folder and file if needed.
   * @param date The note's date in YYYY-MM-DD format.
   * @param line The text line to append.
   * @returns A promise that resolves once the line is written.
   * @throws If the folder or file cannot be created or modified.
   */
  async appendLine(date: string, line: string): Promise<void> {
    const file = await this.getOrCreate(date);
    await this.vault.process(file, (content) => `${content}${line}\n`);
  }

  /**
   * @abstract Reads the day's note.
   * @param date The note's date in YYYY-MM-DD format.
   * @returns The note content, or null if the note does not exist.
   * @throws If the file cannot be read.
   */
  async read(date: string): Promise<string | null> {
    const file = this.find(date);
    return file ? this.vault.read(file) : null;
  }

  /**
   * @abstract Replaces the whole content of the day's existing note. Does nothing if the note does not exist.
   * @param date The note's date in YYYY-MM-DD format.
   * @param content The new note content.
   * @returns A promise that resolves once the content is written.
   * @throws If the file cannot be modified.
   */
  async write(date: string, content: string): Promise<void> {
    const file = this.find(date);
    if (file) {
      await this.vault.modify(file, content);
    }
  }

  /**
   * @abstract Builds the vault path of the day's note.
   * @param date The note's date in YYYY-MM-DD format.
   * @returns The normalized note path.
   * @throws Nothing.
   */
  private pathFor(date: string): string {
    return normalizePath(`${this.getFolder()}/${date}.md`);
  }

  /**
   * @abstract Looks up the day's note file.
   * @param date The note's date in YYYY-MM-DD format.
   * @returns The note file, or null if it does not exist.
   * @throws Nothing.
   */
  private find(date: string): TFile | null {
    const file = this.vault.getAbstractFileByPath(this.pathFor(date));
    return file instanceof TFile ? file : null;
  }

  /**
   * @abstract Returns the day's note file, creating the log folder and an empty file if missing.
   * @param date The note's date in YYYY-MM-DD format.
   * @returns The note file.
   * @throws If the folder or file cannot be created.
   */
  private async getOrCreate(date: string): Promise<TFile> {
    const existing = this.find(date);
    if (existing) {
      return existing;
    }
    const folder = normalizePath(this.getFolder());
    if (!this.vault.getAbstractFileByPath(folder)) {
      await this.vault.createFolder(folder);
    }
    return this.vault.create(this.pathFor(date), "");
  }
}
