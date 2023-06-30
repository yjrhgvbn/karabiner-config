import type { Modifier, FromKeyCode } from "karabiner.ts";
export const HyperCodeList = ["right_command", "right_control", "right_shift", "right_option"] as const;

export function withHyper(keycode: number | FromKeyCode, ...modifier: Modifier[]) {
  return { key_code: keycode, modifiers: { mandatory: modifier.concat(HyperCodeList) } };
}

export function keyToAliases(key: any): string {
  if (Array.isArray(key)) {
    return key
      .map((code) => {
        code = code.trim();
        if (keyAliases[code]) return keyAliases[code];
        const short = code.split("_");
        return keyAliases[short.slice(1).join("_")] || code;
      })
      .join("");
  } else {
    if (typeof key !== "string") return "";
    key = key.trim();
    if (keyAliases[key]) return keyAliases[key];
    const short = key.split("_");
    return keyAliases[short.slice(1).join("_")] || key;
  }
}

export const aliasesKeys = {
  "⌘": "command",
  "⌥": "option",
  "⌃": "control",
  "⇧": "shift",
  "⇪": "caps_lock",
  "↑": "up_arrow",
  "↓": "down_arrow",
  "←": "left_arrow",
  "→": "right_arrow",
  "⇞": "page_up",
  "⇟": "page_down",
  "↖︎": "home",
  "↘︎": "end",
  "⏎": "return_or_enter",
  "⎋": "escape",
  "⌫": "delete_or_backspace",
  "⌦": "delete_forward",
  "⇥": "tab",
  "␣": "spacebar",
  "-": "hyphen",
  "=": "equal_sign",
  "[": "open_bracket",
  "]": "close_bracket",
  "\\": "backslash",
  ";": "semicolon",
  "'": "quote",
  "`": "grave_accent_and_tilde",
  ",": "comma",
  ".": "period",
  "/": "slash",
};
export const keyAliases = Object.entries(aliasesKeys).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);
