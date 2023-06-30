import type { Manipulator, FromKeyCode, FromKeyType } from "karabiner.ts";
import { map } from "karabiner.ts";
import { MdTable } from "./utils";

let mdTable = new MdTable();

function isFromKeyType(x: any): x is FromKeyType {
  return x && x.key_code;
}

export function addPunctuationManipulator(manipulator: Manipulator) {
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
    mdTable.add(fromKey, {
      fromKey,
      description,
      mapAction,
    });
  }
}

export function getPunctuationManiMdJson() {
  const res = mdTable.toMdJson();
  mdTable = new MdTable();
  return res;
}
