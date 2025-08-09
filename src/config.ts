import $ from "jquery";

export interface ConfigEntry {
  name: string;
  value: string;
}

export class Config {
  constructor(private entries: { [name: string]: string }) {}

  getStyles(cardEntryName: string): string {
    return this.entries[`style-${cardEntryName}`] ?? "";
  }

  shouldParseEntry(cardEntryName: string): boolean {
    return this.entries[`parse-${cardEntryName}`] === "TRUE";
  }
}
