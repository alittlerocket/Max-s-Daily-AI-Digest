import { App, Modal, Setting } from "obsidian";

// Pop-up with a text box; passes the entered text to a callback when saved.
export class CaptureModal extends Modal {
  private text = "";

  /**
   * @abstract Creates the pop-up.
   * @param app The Obsidian app.
   * @param onSave Called with the trimmed text when the user saves a non-empty note.
   * @returns Nothing.
   * @throws Nothing.
   */
  constructor(
    app: App,
    private onSave: (text: string) => Promise<void>,
  ) {
    super(app);
  }

  /**
   * @abstract Builds the title, text box and Save button when the pop-up opens.
   * @returns Nothing.
   * @throws Nothing.
   */
  onOpen(): void {
    this.titleEl.setText("Add note");

    const input = this.contentEl.createEl("textarea", {
      attr: { rows: "4", placeholder: "Jot something down. End with ? to ask a question." },
    });
    input.style.width = "100%";
    input.addEventListener("input", () => (this.text = input.value));
    input.focus();

    new Setting(this.contentEl).addButton((button) =>
      button
        .setButtonText("Save")
        .setCta()
        .onClick(async () => {
          await this.save();
        }),
    );
  }

  /**
   * @abstract Clears the pop-up contents when it closes.
   * @returns Nothing.
   * @throws Nothing.
   */
  onClose(): void {
    this.contentEl.empty();
  }

  /**
   * @abstract Passes the entered text to the save callback if it is not blank, then closes the pop-up.
   * @returns A promise that resolves once the pop-up is closed.
   * @throws If the save callback fails.
   */
  private async save(): Promise<void> {
    const trimmed = this.text.trim();
    if (trimmed !== "") {
      await this.onSave(trimmed);
    }
    this.close();
  }
}
