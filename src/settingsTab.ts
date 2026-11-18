import { PluginSettingTab, Setting } from "obsidian";
import type DailyDigestPlugin from "./main";
import { Settings } from "./settings";

// Settings screen listing every field of Settings.
export class DigestSettingsTab extends PluginSettingTab {
  /**
   * @abstract Creates the settings screen for the plugin.
   * @param plugin The plugin whose settings are edited.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(private plugin: DailyDigestPlugin) {
    super(plugin.app, plugin);
  }

  /**
   * @abstract Builds one input per setting each time the screen is shown.
   * @returns Nothing.
   * @throws Nothing.
   */
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addTextSetting("API key", "OpenRouter API key from openrouter.ai/keys.", "apiKey");
    this.addTextSetting("Model", "OpenRouter model ID used for the digest.", "model");
    this.addTextSetting("Log folder", "Folder that holds the daily notes.", "logFolder");
    this.addTextSetting("Digest time", "Local time in HH:mm after which the digest runs.", "digestTime");

    new Setting(containerEl)
      .setName("Prompt template")
      .setDesc("Use {{notes}} and {{questions}} where the day's notes and questions go.")
      .addTextArea((area) => {
        area.inputEl.rows = 10;
        area.inputEl.style.width = "100%";
        area.setValue(this.plugin.data.settings.promptTemplate).onChange(async (value) => {
          this.plugin.data.settings.promptTemplate = value;
          await this.plugin.persist();
        });
      });
  }

  /**
   * @abstract Adds a single-line text input that saves its value to one setting.
   * @param name The label shown for the setting.
   * @param description The help text shown under the label.
   * @param key The setting field the input edits.
   * @returns Nothing.
   * @throws Nothing.
   */
  private addTextSetting(name: string, description: string, key: Exclude<keyof Settings, "promptTemplate">): void {
    new Setting(this.containerEl)
      .setName(name)
      .setDesc(description)
      .addText((text) =>
        text.setValue(this.plugin.data.settings[key]).onChange(async (value) => {
          this.plugin.data.settings[key] = value.trim();
          await this.plugin.persist();
        }),
      );
  }
}
