import $ from "jquery";
import { getSheets } from "./sheets";

function initLinks() {
  const $ul = $("<ul>");
  for (const sheet of getSheets()) {
    const $li = $(`
      <li>
        <a href="/cards.html?sheetId=${sheet.id}">${sheet.name}</a>
        (<a href="https://docs.google.com/spreadsheets/d/${sheet.id}/edit">編集</a>)
      </li>
    `);
    $ul.append($li);
  }
  $("body").append($ul);
}

document.addEventListener("DOMContentLoaded", () => {
  initLinks();
});
