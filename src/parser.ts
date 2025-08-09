import $ from "jquery";
import { BNF, Compile, ParseError, SyntaxNode } from "bnf-parser";
import BNFParser from "bnf-parser";
import { Literals } from "./literal";

const LANGUAGE_BNF = `
program        ::= lines;
lines          ::= line ";" lines | line ;
line           ::= "OR" | coron_stmt ;
coron_stmt     ::= or_stmt ":" arrow_stmt | arrow_stmt ;
arrow_stmt     ::= or_stmt? "→" or_stmt | or_stmt ;
or_stmt        ::= words "/" or_stmt | words ;
words          ::= word+ ;
word           ::= icon_with_text | icon | char ;
icon_with_text ::= icon icon_text ;
icon_text      ::= "{" words "}" | number ;
char           ::= !(";" | ":" | "→" | "{" | "}" | "/") ;
number         ::= "0" | "1"->"9" "0"->"9"* ;
`.trim();

export class Parser {
  private parser: BNFParser.Parser;

  private joinLiterals(nodes: SyntaxNode[]) {
    let str = "";
    for (const node of nodes) {
      str += node.value as string;
    }
    return str;
  }

  // type === 'seq[]'
  private extractSeq(syntax: SyntaxNode) {
    if (syntax.type === 'literal') {
      return syntax;
    }

    let nodes = syntax.value;
    if ((syntax.value[0] as SyntaxNode).type === 'seq[]') {
      nodes = (syntax.value[0] as SyntaxNode).value;
    }

    const newNodes = [];
    for (const node of nodes as SyntaxNode[]) {
      newNodes.push(this.extractSeq(node));
    }
    syntax.value = newNodes;
    return syntax;
  }

  private build(syntax: SyntaxNode): JQuery<HTMLElement> {
    console.log(syntax);
    switch (syntax.type) {
      case 'program': {
        return this.build(syntax.value[0] as SyntaxNode);
      }
      case 'lines': {
        const $lines = $("<div class='lines'>");
        while (syntax) {
          $lines.append(this.build(syntax.value[0] as SyntaxNode));
          syntax = syntax.value[2] as SyntaxNode;
        }
        return $lines;
      }
      case 'line': {
        const $line = $("<div class='line'>");
        const ch = syntax.value[0] as SyntaxNode;
        if (ch.type === "literal") {
          $line.addClass("or");
        }
        else {
          $line.append(this.build(ch));
        }
        return $line;
      }
      case 'coron_stmt': {
        if (syntax.value.length === 1) {
          return this.build(syntax.value[0] as SyntaxNode);
        }
        const $stmt = $("<div class='coron-stmt'>");
        $stmt.append(this.build(syntax.value[0] as SyntaxNode));
        $stmt.append(this.literals.$img("COLON"));
        $stmt.append(this.build(syntax.value[2] as SyntaxNode));
        return $stmt;
      }
      case 'arrow_stmt': {
        if (syntax.value.length === 1) {
          return this.build(syntax.value[0] as SyntaxNode);
        }
        const $stmt = $("<div class='arrow-stmt'>");
        $stmt.append(this.build(syntax.value[0] as SyntaxNode));
        $stmt.append(this.literals.$img("ARROW"));
        $stmt.append(this.build(syntax.value[2] as SyntaxNode));
        return $stmt;
      }
      case 'or_stmt?':
      case 'or_stmt': {
        const $stmt = $("<div class='or-stmt'>");
        while (syntax) {
          $stmt.append(this.build(syntax.value[0] as SyntaxNode));
          if (syntax.value[1]) {
            $stmt.append(this.build(syntax.value[1] as SyntaxNode));
          }
          syntax = syntax.value[2] as SyntaxNode;
        }
        return $stmt;
      }
      case 'words': {
        return this.build(syntax.value[0] as SyntaxNode);
      }
      case 'word+': {
        const $words = $("<div class='words'></div>");
        for (const word of syntax.value as SyntaxNode[]) {
          $words.append(this.build(word));
        }
        return $words;
      }
      case 'word': {
        return this.build(syntax.value[0] as SyntaxNode);
      }
      case 'icon_with_text': {
        const $icon = $("<div class='icon-with-text'></div>");
        $icon.append(this.build(syntax.value[0] as SyntaxNode));
        $icon.append(this.build(syntax.value[1] as SyntaxNode).addClass("icon-text"));
        return $icon;
      }
      case 'icon_text': {
        if (syntax.value.length === 1) {
          return this.build(syntax.value[0] as SyntaxNode);
        }
        return this.build(syntax.value[1] as SyntaxNode).addClass("large");
      }
      case 'char': {
        return this.build(syntax.value[0] as SyntaxNode);
      }
      case 'number': {
        const number = this.joinLiterals(syntax.value as SyntaxNode[]);
        return $(`<div class="number">${number}</div>`);
      }
      case 'icon': {
        const iconName = (syntax.value[0] as SyntaxNode).value as string;
        return this.literals.$img(iconName);
      }
      case 'literal': {
        return $(`<div class="literal">${syntax.value[0]}</div>`);
      }
      default: {
        console.error("BUILD", syntax);
        throw new Error(`Unknown syntax type: ${syntax.type}`);
      }
    }
  }

  constructor(private literals: Literals) {
    const bnf = LANGUAGE_BNF + "\n" + literals.bnf;
    console.log("BNF", bnf);
    const result = BNF.parse(bnf);
    if (result instanceof ParseError) {
      console.error("BNF", bnf, result);
      throw new Error("invalid BNF");
    }
    const tree = Compile(result);
    this.parser = tree;
  }

  parse(text: string): JQuery<HTMLElement> {
    if (text === "") {
      return $("<div>");
    }
    let syntax = this.parser.parse(text);
    if (syntax instanceof ParseError) {
      console.error("TEXT", text, syntax);
      return $(`<div>${syntax.msg}</div>`);
    }
    console.log("TEXT", text, syntax);
    this.extractSeq(syntax);
    return this.build(syntax);
  }
}
