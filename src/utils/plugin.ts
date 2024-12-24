import { generateCode } from "./gpt";
import { crawl } from "./parser";

export async function showCode() {
  figma.notify("Generating code...");
  const target = figma.currentPage;
  const selected = target.selection[0];
  crawl(selected).then(async (node) => {
    figma.ui.postMessage({ type: "loading-code" });
    const code = await generateCode(JSON.stringify(node));
    figma.ui.postMessage({
      type: "generate-code",
      data: code,
    });
  });
}
