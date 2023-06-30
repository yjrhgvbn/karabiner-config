import { map, mapSimultaneous } from "karabiner.ts";
import { withHyper } from "../utils";
import { describe } from "node:test";

export const PUNCTUATION_KEY_ID = "punctuation_flag";
export const PUNCTUATION_KEY = "semicolon";
export const PUNCTUATION_KEY_DESC = "分号";

export function prefixMap() {
  return [
    map({
      key_code: "caps_lock",
      modifiers: {
        optional: ["any"],
      },
    })
      .to({
        key_code: "right_shift",
        modifiers: ["right_command", "right_control", "right_option"],
      })
      .toIfAlone("escape")
      .description('按下时相当于hyper，单击相当于"esc"'),
    initPunctuation(),
  ];
}

function initPunctuation() {
  return map({ key_code: PUNCTUATION_KEY })
    .description(`${PUNCTUATION_KEY_DESC}作为符号键`)
    .to({
      set_variable: {
        value: 1,
        name: PUNCTUATION_KEY_ID,
      },
    })
    .toAfterKeyUp({
      set_variable: {
        value: 0,
        name: PUNCTUATION_KEY_ID,
      },
    })
    .toIfAlone({ key_code: PUNCTUATION_KEY });
}
