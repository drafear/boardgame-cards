import { Card } from "./card";
import { Config } from "./config";
import { Literals } from "./literal";

export interface Sheet {
  id: string;
  name: string;
}

export function getSheets(): Sheet[] {
  return [
    {
      name: "RPG",
      id: "13PSx75qHL35kBEUQoyvRSrsXtVOVgIb-hUO7P6M6reE",
    },
  ];
}

export function getSheetFromId(sheetId: string): Sheet {
  for (const sheet of getSheets()) {
    if (sheet.id === sheetId) {
      return sheet;
    }
  }
  throw new Error(`Unknown sheet: ${sheetId}`);
}

export interface SheetContent {
  literals: Literals;
  config: Config;
  cards: Card[];
}

export async function getSheetData(sheet: Sheet): Promise<SheetContent> {
  const literals = await getLiterals(sheet);
  const config = await getConfig(sheet);
  const cards = await getCards(sheet);
  return { literals, config, cards };
}

async function fetchSheet(sheet: Sheet, sheetName: string): Promise<any[]> {
  const key = process.env.SPREADSHEET_KEY;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/${sheetName}?key=${key}`);
  const json = await res.json();
  console.log("fetchSheet:", sheet, sheetName, json);
  return json.values;
}

async function getLiterals(sheet: Sheet): Promise<Literals> {
  const data = await fetchSheet(sheet, "literal");
  const entries: { [name: string]: string } = {};
  for (const line of data) {
    const [text, imageName] = line;
    entries[text] = imageName;
  }
  return new Literals(entries);
}

async function getConfig(sheet: Sheet): Promise<Config> {
  const data = await fetchSheet(sheet, "config");
  const entries: { [name: string]: string } = {};
  for (const line of data) {
    const [name, value] = line;
    entries[name] = value;
  }
  return new Config(entries);
}

async function getCards(sheet: Sheet): Promise<Card[]> {
  const data = await fetchSheet(sheet, "latest");
  const header = data[0];
  const cards = [];
  for (const line of data.slice(1)) {
    const entries: { [name: string]: string } = {};
    for (let i = 0; i < header.length; ++i) {
      entries[header[i]] = line[i] ?? "";
    }
    cards.push(new Card(entries));
  }
  return cards;
}
