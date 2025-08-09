import $ from "jquery";
import { Parser } from "./parser";
import { getSheetData, getSheetFromId, SheetContent } from "./sheets";
import { getParam, PageManager } from "./util";

function showCards(data: SheetContent) {
  const $doc = $("<div class='doc'></div>");
  const pm = new PageManager($doc, 3, 3);
  const parser = new Parser(data.literals);
  for (const card of data.cards) {
    const $card = card.$(parser, data.config);
    pm.add($card);
  }
  pm.finalize();
  $("body").append($doc);
}

document.addEventListener("DOMContentLoaded", async () => {
  const sheetId = getParam("sheetId");
  const sheet = getSheetFromId(sheetId!);
  const data = await getSheetData(sheet);
  showCards(data);
});
