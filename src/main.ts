import { Notice, Plugin } from "obsidian";
import { CaptureModal } from "./captureModal";
import { DailyNotes } from "./dailyNotes";
import { DataStore, LocalDataStore } from "./dataStore";
import { formatDate, formatTime } from "./dateTime";
import { DigestService } from "./digestService";
import { DigestSchedule } from "./schedule";
import { DEFAULT_DATA, PluginData } from "./settings";
import { DigestSettingsTab } from "./settingsTab";

export default class DailyDigestPlugin extends Plugin {
  data: PluginData = DEFAULT_DATA;

  private store: DataStore = new LocalDataStore(this);
  private notes = new DailyNotes(this.app.vault, () => this.data.settings.logFolder);
  private digest = new DigestService(this.notes, () => this.data.settings);

  /**
   * @abstract Loads saved data, registers the settings tab, ribbon icon and commands, and checks if a digest is due.
   * @returns A promise that resolves once the plugin is set up.
   * @throws If the saved data cannot be loaded.
   */
  async onload(): Promise<void> {
    this.data = await this.store.load();

    this.addSettingTab(new DigestSettingsTab(this));
    this.addRibbonIcon("pencil", "Add note", () => this.openCapture());
    this.addCommand({ id: "add-note", name: "Add note", callback: () => this.openCapture() });
    this.addCommand({ id: "run-digest", name: "Run digest now", callback: () => this.runDigest() });

    this.app.workspace.onLayoutReady(() => this.runDigestIfDue());
  }

  /**
   * @abstract Saves the current plugin data through the configured data store.
   * @returns A promise that resolves once the data is saved.
   * @throws If the data store cannot save.
   */
  async persist(): Promise<void> {
    await this.store.save(this.data);
  }

  /**
   * @abstract Opens the pop-up that appends a timestamped line to today's note.
   * @returns Nothing.
   * @throws Nothing.
   */
  private openCapture(): void {
    new CaptureModal(this.app, async (text) => {
      const now = new Date();
      await this.notes.appendLine(formatDate(now), `- ${formatTime(now)} ${text}`);
    }).open();
  }

  /**
   * @abstract Runs the digest if the digest time has passed and today's digest has not run.
   * @returns A promise that resolves once the check and any digest finish.
   * @throws Nothing.
   */
  private async runDigestIfDue(): Promise<void> {
    const schedule = new DigestSchedule(this.data.settings.digestTime);
    if (schedule.isDue(new Date(), this.data.lastDigestDate)) {
      await this.runDigest();
    }
  }

  /**
   * @abstract Runs today's digest, records that it ran, and shows the outcome in a notice.
   * @returns A promise that resolves once the digest finishes or fails.
   * @throws Nothing. Failures are shown in a notice.
   */
  private async runDigest(): Promise<void> {
    const today = formatDate(new Date());
    const progress = new Notice("Daily digest: generating...", 0);
    try {
      const written = await this.digest.run(today);
      progress.hide();
      if (!written) {
        new Notice("Daily digest: no notes for today.");
        return;
      }
      this.data.lastDigestDate = today;
      await this.persist();
      new Notice("Daily digest written to today's note.");
    } catch (error) {
      progress.hide();
      new Notice(`Daily digest failed: ${error}`);
    }
  }
}
