import { map, complexModifications, rule, withMapper, writeToProfile, ifKeyboardType } from "karabiner.ts";
import { writeFile } from "fs/promises";
import { navigationMap, keyMap, punctuationMap, prefixMap } from "./ruler";
import { generateDoc } from "./doc";
// ["⌘", "⌥", "⌃", "⇧", "⇪"]
// ["←", "→", "↑", "↓", "␣", "⏎", "⇥", "⎋", "⌫", "⌦", "⇪"]

const ruler = [
  rule("前置配置").manipulators(prefixMap()),
  rule("导航功能").manipulators(navigationMap()),
  rule("hyper按钮映射").manipulators(keyMap()),
  rule("符号输入").manipulators(punctuationMap()),
];
async function main() {
  await writeFile("./ruler.json", JSON.stringify(complexModifications(ruler), null, 2));
  await generateDoc();
  writeToProfile("test", ruler);
}
main();
