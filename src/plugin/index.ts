import { GenerateType } from "./types";
import * as board from "../figma";

export const generate = (type: GenerateType) => {
  let code = "";
  switch (type) {
    case GenerateType.SELECTED:
      code = board.getSelectedReactNode().createComponent();
      break;
    case GenerateType.PAGE:
      break;
    case GenerateType.ALL:
      break;
  }
  setTimeout(() => {
    figma.ui.postMessage({ type: "generate-code", data: code });
  }, 500); 
};
