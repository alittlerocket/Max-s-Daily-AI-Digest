# Max's Daily AI Digest

An Obsidian plugin for iPhone. Jot notes through the day; the first time you open Obsidian after the digest time, the day's notes are sent to an LLM through OpenRouter and a summary plus answers are written into the same note.

## Setup checklist

1. Install Obsidian on iPhone and create a vault.
2. Create an API key at openrouter.ai/keys. The default model, `inclusionai/ling-3.2-flash:free`, is free, so no credit is needed. Free models have rate limits.
3. Push this repo to GitHub, then tag a release: `git tag v0.1.0 && git push --tags`. The release workflow publishes `main.js` and `manifest.json`.
4. In Obsidian on the phone, install the BRAT plugin, add this repo, enable the plugin, and paste the API key into the plugin settings.

## Usage

- **Add note** (ribbon icon or command): appends `- HH:mm text` to `Daily Log/YYYY-MM-DD.md`.
- Any line ending in `?` is treated as a question for the model to answer.
- **Run digest now** (command): runs the digest immediately and replaces the earlier one.
- The digest is written below your notes between `<!-- digest:start -->` and `<!-- digest:end -->`.

## Development

```
npm install
npm test
npm run build
```

Copy `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/daily-ai-digest/` to try a local build.
