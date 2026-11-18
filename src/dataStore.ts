import { Plugin } from "obsidian";
import { DEFAULT_DATA, DEFAULT_SETTINGS, PluginData } from "./settings";

// Where the plugin's settings and state are loaded from and saved to.
// Implement this interface to store the data somewhere other than data.json.
export interface DataStore {
  load(): Promise<PluginData>;
  save(data: PluginData): Promise<void>;
}

// Stores plugin data in the plugin's local data.json file.
export class LocalDataStore implements DataStore {
  /**
   * @abstract Stores the plugin whose data.json file is used.
   * @param plugin The plugin that owns the data.json file.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(private plugin: Plugin) {}

  /**
   * @abstract Reads data.json and fills any missing values with defaults.
   * @returns The plugin data.
   * @throws If data.json cannot be read.
   */
  async load(): Promise<PluginData> {
    const saved: Partial<PluginData> | null = await this.plugin.loadData();
    return {
      ...DEFAULT_DATA,
      ...saved,
      settings: { ...DEFAULT_SETTINGS, ...saved?.settings },
    };
  }

  /**
   * @abstract Writes the plugin data to data.json.
   * @param data The plugin data to save.
   * @returns A promise that resolves once the data is written.
   * @throws If data.json cannot be written.
   */
  async save(data: PluginData): Promise<void> {
    await this.plugin.saveData(data);
  }
}
