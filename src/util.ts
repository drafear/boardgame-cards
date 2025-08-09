import $ from "jquery";

/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
export function getParam(name: string, url: string | undefined = undefined) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export class PageManager {
  private $lastPage: JQuery<HTMLElement> | undefined = undefined;
  private $lastRearPage: JQuery<HTMLElement> | undefined = undefined;
  private $lastRow: JQuery<HTMLElement> | undefined = undefined;
  private $lastRearRow: JQuery<HTMLElement> | undefined = undefined;
  private x: number = 0;
  private y: number = 0;

  constructor(private $doc: JQuery<HTMLElement>, private h: number, private w: number) {}

  private appendPage() {
    if (this.$lastPage) {
      this.$doc.append(this.$lastPage);
    }
    if (this.$lastRearPage && this.$lastRearPage.find("* > * > *").length > 0) {
      console.log(this.$lastRearPage.find("* > * > *"));
      this.$doc.append(this.$lastRearPage);
    }
  }

  private $newPage() {
    const $page = $("<div>");
    $page.addClass("page");
    return $page;
  }

  private $newRow($page: JQuery<HTMLElement>) {
    const $row = $("<div>").addClass("page-row");
    $page.append($row);
    return $row;
  }

  private nextPage() {
    this.appendPage();

    this.$lastPage = this.$newPage();
    this.$lastRearPage = this.$newPage();
    this.$lastRearPage.addClass("rear");

    this.y = 0;
  }

  private nextRow() {
    if (!this.$lastPage || ++this.y >= this.h) {
      this.nextPage();
    }

    this.$lastRow = this.$newRow(this.$lastPage!);
    this.$lastRearRow = this.$newRow(this.$lastRearPage!);

    this.x = 0;
  }

  add($card: JQuery<HTMLElement>, $rearCard: JQuery<HTMLElement> | undefined = undefined) {
    if (!this.$lastRow || ++this.x >= this.w) {
      this.nextRow();
    }

    this.$lastRow!.append($card);
    if ($rearCard) {
      this.$lastRearRow!.append($rearCard);
    }
  }

  finalize() {
    this.appendPage();
  }
}
