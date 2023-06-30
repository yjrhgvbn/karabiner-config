import type { Manipulator, FromKeyCode, FromKeyType } from "karabiner.ts";
import { map } from "karabiner.ts";
import { MdTable } from "./utils";
import json2md from "json2md";
import { without } from "lodash";
import { HyperCodeList, keyToAliases } from "../utils";

class NavigationMdTable extends MdTable {
  toMdJson() {
    if (this.keyCodeMap.size === 0) return [];
    const mdJson: json2md.DataObject[] = [];
    const headers = ["键\\修饰"];
    const rows: { [column: string]: string }[] = [];
    this.keyCodeMap.forEach((mdInfoList, k) => {
      const row: { [column: string]: string } = { [headers[0]]: `\`${keyToAliases(k)}\`` };
      mdInfoList.forEach((mdInfo) => {
        const header = keyToAliases(mdInfo.mandatory) || "*";
        if (!headers.includes(header)) {
          headers.push(header);
        }
        row[header] = mdInfo.description + " " + this.transformAction(mdInfo.mapAction);
      });
      rows.push(row);
    });
    this.fillTable(headers, rows);
    mdJson.push({
      table: { headers, rows },
    });
    return mdJson;
  }
}

let mdTable = new NavigationMdTable();

function isFromKeyType(x: any): x is FromKeyType {
  return x && x.key_code;
}

export function addHyperManipulator(manipulator: Manipulator) {
  if (manipulator.type !== "basic") return;
  const { from, to, description = "" } = manipulator;
  if (isFromKeyType(from)) {
    const fromKey = (from as { key_code: FromKeyCode })?.key_code;
    const mapAction =
      to
        ?.map((v) => {
          return {
            modifiers: v.modifiers || [],
            key_code: (v as { key_code: FromKeyCode })?.key_code || "",
          };
        })
        .filter(Boolean) || [];

    const withoutHyperMandatory = without(from.modifiers?.mandatory, ...HyperCodeList);
    mdTable.add(fromKey, {
      fromKey,
      description,
      mapAction,
      mandatory: withoutHyperMandatory,
    });
  }
}

export function getHyperManiMdJson() {
  const res = mdTable.toMdJson();
  mdTable = new NavigationMdTable();
  return res;
}
