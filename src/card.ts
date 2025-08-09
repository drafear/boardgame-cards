import $ from 'jquery';
import { Config } from "./config";
import { Parser } from "./parser";

export class Card {
  constructor(private entries: { [name: string]: string }) {}

  $(parser: Parser, config: Config): JQuery<HTMLElement> {
    const $entries: JQuery<HTMLElement>[] = [];
    for (const [name, value] of Object.entries(this.entries)) {
      if (name === "style") continue;

      const styles = config.getStyles(name);
      const $entry = $(`<div class="entry ${name}" style="${styles}"></div>`);
      if (config.shouldParseEntry(name)) {
        $entry.append(parser.parse(value));
      }
      else {
        $entry.text(value);
      }
      $entries.push($entry);
    }
    return $(`<div class="${this.entries.style}" style="${config.getStyles("card")}"></div>`).append($entries);
  }
}
