import $ from "jquery";

export class Literals {
  constructor(private entries: { [name: string]: string }) {}

  getIdFromName(name: string) {
    return this.entries[name];
  }

  get bnf() {
    const literals = Object.keys(this.entries).map(name => `"${name}"`).join(" | ");
    return `
icon ::= ${literals};
    `.trim();
  }

  $img(name: string) {
    const id = this.getIdFromName(name);
    return $(`<img src="/img/${id}.png" class="icon">`);
  }
}
