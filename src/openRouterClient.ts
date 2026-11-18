import { requestUrl } from "obsidian";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Sends a single prompt to the OpenRouter chat completions API and returns the text reply.
export class OpenRouterClient {
  /**
   * @abstract Stores the credentials and model used for requests.
   * @param apiKey The OpenRouter API key.
   * @param model The OpenRouter model ID, for example "inclusionai/ling-3.2-flash:free".
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  /**
   * @abstract Sends one prompt to the chat completions API.
   * @param prompt The full prompt text.
   * @returns The text of the model's reply.
   * @throws If the request fails, for example an invalid API key or no network connection.
   */
  async ask(prompt: string): Promise<string> {
    const response = await requestUrl({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    return response.json.choices[0].message.content;
  }
}
