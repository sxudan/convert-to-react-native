import { generateCode } from "./gpt";
import { crawl } from "./parser";

export function showCode() {
  const selectedNode = figma.currentPage.selection[0] as InstanceNode;
  crawl(selectedNode).then(async (node) => {
    figma.ui.postMessage({ type: "loading-code" });
    const code = await generateCode(JSON.stringify(node));
    figma.ui.postMessage({
      type: "generate-code",
      data: code,
    });
  });
}
