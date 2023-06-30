import { map, withMapper } from "karabiner.ts";
import { withHyper, keyToAliases } from "../utils";

const arrowMap = {
  h: "left_arrow",
  j: "down_arrow",
  k: "up_arrow",
  l: "right_arrow",
  g: "home",
  semicolon: "end",
} as const;

const navigationCode = ["h", "j", "k", "l", "g", "semicolon"] as const;

export function navigationMap() {
  return [
    withMapper(navigationCode)((k) => {
      return map({ key_code: k, modifiers: { mandatory: ["left_option"] } })
        .to(arrowMap[k], "⌥")
        .description(`相当于`);
    }),
    withMapper(navigationCode)((k, i) => {
      const arrowIcon = ["⬅️", "⬇️", "⬆️", "➡️", "行首", "行尾"];
      return map(withHyper(k)).to(arrowMap[k]).description(arrowIcon[i]);
    }),
    withMapper(navigationCode.slice(0, 4))((k) => {
      return map(withHyper(k, "left_option"))
        .to({
          key_code: arrowMap[k],
          modifiers: ["left_shift", "left_option"],
        })
        .description(`与方向键一致`);
    }),
    withMapper(["h", "l"])((k, i) => {
      return map(withHyper(k, "left_command"))
        .to({
          key_code: arrowMap[k],
          modifiers: ["left_shift", "left_command"],
        })
        .description(`选中到行${!i ? "首" : "尾"}边界`);
    }),
    withMapper(["j", "k"])((k, i) => {
      return map(withHyper(k, "left_command"))
        .to({
          key_code: arrowMap[k],
          modifiers: ["left_shift"],
        })
        .description(`选中到${!i ? "上" : "下"}行`);
    }),
    withMapper(["y", "u", "i", "o"])((k, i) => {
      const arrowIcon = ["⬅️", "⬇️", "⬆️", "➡️"];
      const xList = [-800, 0, 0, 800];
      const yList = [0, 800, -800, 0];
      return map(withHyper(k))
        .to({
          mouse_key: {
            x: xList[i],
            y: yList[i],
          },
        })
        .description(`鼠标${arrowIcon[i]}滚动`);
    }),
    map(withHyper("p"))
      .to({
        pointing_button: "button1",
      })
      .description(`鼠标左键`),
    withMapper(["m", "comma"])((k, i) => {
      return map(withHyper(k))
        .to({
          mouse_key: {
            vertical_wheel: !i ? 32 : -32,
          },
        })
        .description(`鼠标滑轮${!i ? "上" : "下"}滚动`);
    }),
  ];
}
