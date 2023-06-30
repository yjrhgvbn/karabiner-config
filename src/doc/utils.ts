import json2md from "json2md";
import { keyToAliases } from "../utils";

interface MdInfo {
  fromKey: string;
  mandatory?: string[];
  description: string;
  mapAction: { modifiers: string[]; key_code: string }[];
}

export class MdTable {
  keyCodeMap = new Map<string, MdInfo[]>();
  constructor() {}
  add(header: string, mdInfo: MdInfo) {
    if (!this.keyCodeMap.has(header)) {
      this.keyCodeMap.set(header, []);
    }
    this.keyCodeMap.get(header)?.push(mdInfo);
  }
  transformKey(modifiers: string[], key_code: string) {
    const pre = keyToAliases(modifiers);
    const tail = keyToAliases(key_code);
    if (pre) {
      if (pre === "`" || tail === "`") return `${pre} ${tail}`;
      return `\`${pre} + ${tail}\``;
    } else {
      if (tail === "`") return tail;
      if (!tail) return "";
      return `\`${tail}\``;
    }
  }
  transformAction(mapAction: MdInfo["mapAction"]) {
    const res = mapAction
      .map((v) => {
        const { modifiers, key_code } = v;
        return this.transformKey(modifiers, key_code);
      })
      .join("+");
    return res;
  }
  fillTable(headers: string[], rows: { [column: string]: string }[]) {
    headers.forEach((header) => {
      rows.forEach((row) => {
        if (!row[header]) {
          row[header] = "";
        }
      });
    });
  }
  toMdJson() {
    if (this.keyCodeMap.size === 0) return [];
    const mdJson: json2md.DataObject[] = [];
    const headers = ["按键", "描述", "映射"];
    const rows: { [column: string]: string }[] = [];
    this.keyCodeMap.forEach((mdInfoList, k) => {
      mdInfoList.forEach((mdInfo) => {
        rows.push({
          [headers[0]]: this.transformKey(mdInfo.mandatory || [], k),
          [headers[1]]: mdInfo.description,
          [headers[2]]: this.transformAction(mdInfo.mapAction),
        });
      });
    });
    this.fillTable(headers, rows);
    mdJson.push({
      table: { headers, rows },
    });
    return mdJson;
  }
}
