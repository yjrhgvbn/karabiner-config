import { map, mapSimultaneous, ToKeyCode, FromKeyCode, ComplexModifications } from "karabiner.ts";
import { withHyper } from "../utils";
import { describe } from "node:test";
import { PUNCTUATION_KEY, PUNCTUATION_KEY_ID } from "./prefix";

export function punctuationMap() {
  return [
    punctuationKeyBind("spacebar", [PUNCTUATION_KEY, "spacebar"], `空格不做映射`, false),
    punctuationKeyBind("return_or_enter", [PUNCTUATION_KEY, "return_or_enter"], "回车不做映射", false),
    punctuationKeyBind("tab", [PUNCTUATION_KEY, "tab"], "tab不做映射", false),
    punctuationKeyBind("q", "1", "感叹号 `!`"),
    punctuationKeyBind("w", "2", "at `@`"),
    punctuationKeyBind("e", "3", "井号 `#`"),
    punctuationKeyBind("r", "4", "美元符号 `$`"),
    punctuationKeyBind("t", "6", "抑扬符号 `^`"),
    punctuationKeyBind("y", "7", "与符号 `&`"),
    punctuationKeyBind("u", "8", "星号 `*`"),
    punctuationKeyBind("i", "hyphen", "减号 `-`", false),
    punctuationKeyBind("o", "equal_sign", "加号 `+`"),

    punctuationKeyBind("a", "9", "左括号 `(`"),
    punctuationKeyBind("s", "0", "右括号 `)`"),
    punctuationKeyBind("d", "open_bracket", "左中括号 `[`", false),
    punctuationKeyBind("f", "close_bracket", "右中括号 `]`", false),
    punctuationKeyBind("g", "open_bracket", "左大括号 `{`"),
    punctuationKeyBind("h", "close_bracket", "右大括号 `}`"),

    punctuationKeyBind("j", "equal_sign", "等于 `=`", false),
    punctuationKeyBind("k", "hyphen", "下划线 `_`"),
    punctuationKeyBind("l", "grave_accent_and_tilde", "重音符号 `", false),

    punctuationKeyBind("v", "slash", "斜杆 `//`", false),
    punctuationKeyBind("b", "backslash", "竖杠 `|`"),
    punctuationKeyBind("m", "slash", "问号 `?`"),

    // punctuationKeyBind("a", "hyphen", "减号 -", false),
    // punctuationKeyBind("s", "equal_sign", "加号 +"),
    // punctuationKeyBind("d", "hyphen", "下划线 _"),
    // punctuationKeyBind("f", "equal_sign", "等于 =", false),
  ];
}

function punctuationKeyBind(fromKey: FromKeyCode, toKey: ToKeyCode | ToKeyCode[], dec: string = "", withShift = true) {
  const res = map({ key_code: fromKey }).description(dec).condition({
    name: PUNCTUATION_KEY_ID,
    value: 1,
    type: "variable_if",
  });
  if (Array.isArray(toKey)) {
    toKey.forEach((key) => {
      res.to({ key_code: key });
    });
  } else {
    res.to({ key_code: toKey, ...(withShift ? { modifiers: ["left_shift"] } : {}) });
  }
  return res;
}
