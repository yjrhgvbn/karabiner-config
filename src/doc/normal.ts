import type { Manipulator, FromKeyCode, FromKeyType } from "karabiner.ts";
import { map } from "karabiner.ts";
import { MdTable } from "./utils";
import { without } from "lodash";
import { HyperCodeList } from "../utils";

let mdTable = new MdTable();

function isFromKeyType(x: any): x is FromKeyType {
  return x && x.key_code;
}

export function addNormalManipulator(manipulator: Manipulator) {
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
      mandatory: from.modifiers?.mandatory || [],
    });
  }
}

export function getNormalManiMdJson() {
  const res = mdTable.toMdJson();
  mdTable = new MdTable();
  return res;
}
