import { GenerateType } from "./types";
import * as board from "../figma";

export const generate = async (type: GenerateType) => {
  let code = "";

  // console.log(board.getSelectedReactNode().getTree())
  // return 
  switch (type) {
    case GenerateType.SELECTED:
      code = await board.getSelectedReactNode().createComponent();
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
