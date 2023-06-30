import { map, mapSimultaneous } from "karabiner.ts";
import { withHyper } from "../utils";
import { describe } from "node:test";

export function keyMap() {
  return [
    map(withHyper("spacebar"))
      .to({
        key_code: "delete_or_backspace",
      })
      .description("空格删除"),
  ];
}
