import { ComplexModifications, Rule, rule, Manipulator } from "karabiner.ts";
import { readFile, writeFile } from "fs/promises";
import json2md from "json2md";
import { HyperCodeList, keyToAliases } from "../utils";
import { PUNCTUATION_KEY_ID } from "../ruler";
import { without } from "lodash";
import { addPunctuationManipulator, getPunctuationManiMdJson } from "./punctuation";
import { addHyperManipulator, getHyperManiMdJson } from "./hyper";
import { addNormalManipulator, getNormalManiMdJson } from "./normal";

export async function generateDoc() {
  const ruleRow = await readFile("./ruler.json");
  const { rules } = JSON.parse(ruleRow.toString()) as ComplexModifications;

  let makJson: json2md.DataObject = [];
  rules.forEach((rule) => {
    makJson = makJson.concat(...parseRule(rule));
  });
  const md = json2md(makJson);
  writeFile("./docs/README.md", md);
}

enum ManipulatorType {
  normal,
  punctuation,
  hyper,
}

function getManipulatorType(manipulator: Manipulator) {
  const { conditions = [], from } = manipulator;

  if (conditions.some((v) => v.type === "variable_if" && v.name === PUNCTUATION_KEY_ID && v.value === 1)) {
    return {
      type: ManipulatorType.punctuation,
    };
  }
  if (from && from.modifiers && from.modifiers.mandatory) {
    const mandatory = from.modifiers.mandatory;
    const withoutHyperMandatory = without(mandatory, ...HyperCodeList);
    if (mandatory.length - withoutHyperMandatory.length === HyperCodeList.length) {
      return {
        type: ManipulatorType.hyper,
      };
    }
  }

  return {
    type: ManipulatorType.normal,
  };
}

function parseRule(rule: Rule) {
  const mdJson = [];
  const { description, manipulators } = rule;
  mdJson.push({ h1: description });
  for (let i = 0; i < manipulators.length; i++) {
    const manipulator = manipulators[i];
    const { type } = getManipulatorType(manipulator);
    switch (type) {
      case ManipulatorType.punctuation:
        addPunctuationManipulator(manipulator);
        break;
      case ManipulatorType.hyper:
        addHyperManipulator(manipulator);
        break;
      default:
        addNormalManipulator(manipulator);
    }
  }
  mdJson.push(setMdJson(getNormalManiMdJson(), "普通映射"));
  mdJson.push(setMdJson(getPunctuationManiMdJson(), "需要按下分号键`;`的映射"));
  mdJson.push(setMdJson(getHyperManiMdJson(), "需要按下`caps_lock`键的映射"));
  return mdJson;
}

function setMdJson(md: json2md.DataObject[], title: string) {
  if (!md.length) return {};
  return { blockquote: [title, "\n", ...md] };
}

function parseManipulators(manipulators: any) {
  try {
    const keyCodeMap = new Map<string, any[]>();
    const hyperKeyCodeMap = new Map<string, any[]>();
    for (let i = 0; i < manipulators.length; i++) {
      const { from, to, description = "", type } = manipulators[i];
      if (type !== "basic") continue;
      const { key_code: fromCode, modifiers: fromModifiers } = from;
      const { mandatory: formMandatoryRow } = fromModifiers;
      const { isHyper, codes: formMandatory } = verifyHyperCode(formMandatoryRow);
      // 暂时只处理一个
      const { key_code: toCode, modifiers: toModifiers } = to[0];
      let keyCodeMapValue = [];
      if (!isHyper) {
        keyCodeMapValue = keyCodeMap.get(fromCode)! || [];
      } else {
        keyCodeMapValue = hyperKeyCodeMap.get(fromCode)! || [];
      }
      keyCodeMapValue.push({
        description,
        formMandatory,
        toCode,
        toModifiers,
      });
      if (!isHyper) {
        keyCodeMap.set(fromCode, keyCodeMapValue);
      } else {
        hyperKeyCodeMap.set(fromCode, keyCodeMapValue);
      }
    }
    return [keyCodeMap, hyperKeyCodeMap];
  } catch (e) {
    return [];
  }
}

function map2mdJson(map: Map<string, any[]>) {
  const headers: string[] = ["键\\修饰"];
  const row: Record<string, string>[] = [];
  for (let [key, values] of map.entries()) {
    const newRow: Record<string, string> = { "键\\修饰": key };
    values.forEach((value) => {
      const { description, formMandatory = [], toCode, toModifiers = [] } = value;
      const header = keyToAliases(formMandatory) || "*";
      if (!headers.includes(header)) headers.push(header);
      const preKey = keyToAliases(toModifiers);
      const tailKey = keyToAliases(toCode);
      const toKey = preKey ? `${preKey} + ${tailKey}` : tailKey;
      newRow[header] = description ? `${description} (${toKey})` : toKey;
    });
    row.push(newRow);
  }
  return { headers, row };
}

function verifyHyperCode(modifiers: string[] = []) {
  const flags = new Array(modifiers.length).fill(false);
  let allMatch = true;
  for (let i = 0; i < HyperCodeList.length; i++) {
    const HyperCode = HyperCodeList[i];
    const indx = modifiers.indexOf(HyperCode);
    if (indx !== -1) {
      flags[indx] = true;
    } else {
      allMatch = false;
    }
  }
  let codes = modifiers;
  if (allMatch) {
    codes = modifiers.filter((_, i) => !flags[i]);
  }
  return { isHyper: allMatch, codes };
}
