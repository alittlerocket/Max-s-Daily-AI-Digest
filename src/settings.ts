export const DEFAULT_PROMPT_TEMPLATE = `You are my daily journal assistant. Below are the notes I jotted down today.

Notes:
{{notes}}

Questions:
{{questions}}

First write a short summary of my day. Then add a section titled "Answers" that answers each question in order. If there are no questions, omit the "Answers" section.`;

// User-editable options shown in the settings tab.
export interface Settings {
  apiKey: string;
  model: string;
  logFolder: string;
  // Local time of day in "HH:mm" after which the digest may run.
  digestTime: string;
  promptTemplate: string;
}

export const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  model: "inclusionai/ling-3.2-flash:free",
  logFolder: "Daily Log",
  digestTime: "21:00",
  promptTemplate: DEFAULT_PROMPT_TEMPLATE,
};

// Everything the plugin persists between sessions.
export interface PluginData {
  settings: Settings;
  // Date (YYYY-MM-DD) of the most recent digest. Empty if none.
  lastDigestDate: string;
}

export const DEFAULT_DATA: PluginData = {
  settings: DEFAULT_SETTINGS,
  lastDigestDate: "",
};
