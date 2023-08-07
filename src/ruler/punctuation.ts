import { map, ToKeyCode, FromKeyCode } from "karabiner.ts";
import { PUNCTUATION_KEY, PUNCTUATION_KEY_ID } from "./prefix";

export function punctuationMap() {
  return [
    // punctuationKeyBind("spacebar", [PUNCTUATION_KEY, "spacebar"], `空格不做映射`, false),
    punctuationKeyBind(
      "return_or_enter",
      [PUNCTUATION_KEY, "return_or_enter"],
      "回车不做映射",
      false
    ),
    punctuationKeyBind("tab", [PUNCTUATION_KEY, "tab"], "tab不做映射", false),
    punctuationKeyBind("q", "1", "感叹号 `!`"),
    punctuationKeyBind("w", "2", "at `@`"),
    punctuationKeyBind("e", "3", "井号 `#`"),
    punctuationKeyBind("r", "4", "美元符号 `$`"),
    punctuationKeyBind("t", "5", "百分号 `%`"),
    punctuationKeyBind("y", "6", "抑扬符号 `^`"),
    punctuationKeyBind("u", "7", "与符号 `&`"),
    punctuationKeyBind("i", "8", "星号 `*`"),
    punctuationKeyBind("o", "grave_accent_and_tilde", "重音符号 `", false),

    punctuationKeyBind("a", "9", "左括号 `(`"),
    punctuationKeyBind("s", "0", "右括号 `)`"),
    punctuationKeyBind("d", "open_bracket", "左中括号 `[`", false),
    punctuationKeyBind("f", "close_bracket", "右中括号 `]`", false),
    punctuationKeyBind("g", "open_bracket", "左大括号 `{`"),
    punctuationKeyBind("h", "close_bracket", "右大括号 `}`"),

    punctuationKeyBind("j", "equal_sign", "等于 `=`", false),
    punctuationKeyBind("k", "backslash", "左斜杆 `\\`", false),
    punctuationKeyBind("l", "backslash", "竖杠 `|`"),

    punctuationKeyBind("c", "slash", "斜杆 `//`", false),
    punctuationKeyBind("v", "slash", "问号 `?`"),
    punctuationKeyBind("b", "hyphen", "减号 `-`", false),
    punctuationKeyBind("n", "equal_sign", "加号 `+`"),
    punctuationKeyBind("m", "hyphen", "下划线 `_`"),
    // punctuationKeyBind("m", "slash", "问号 `?`"),
    // punctuationKeyBind("k", "hyphen", "下划线 `_`"),

    // punctuationKeyBind("i", "hyphen", "减号 `-`", false),
    // punctuationKeyBind("o", "equal_sign", "加号 `+`"),

    // punctuationKeyBind("a", "hyphen", "减号 -", false),
    // punctuationKeyBind("s", "equal_sign", "加号 +"),
    // punctuationKeyBind("d", "hyphen", "下划线 _"),
    // punctuationKeyBind("f", "equal_sign", "等于 =", false),
  ];
}

function punctuationKeyBind(
  fromKey: FromKeyCode,
  toKey: ToKeyCode | ToKeyCode[],
  dec: string = "",
  withShift = true
) {
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
    res.to({
      key_code: toKey,
      ...(withShift ? { modifiers: ["left_shift"] } : {}),
    });
  }
  return res;
}
