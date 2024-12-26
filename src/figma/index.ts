import { ReactNativeNode } from "../generator/react-native/react-native-node";
import { createUpdatedSceneNode } from "./nodes";

export function getSelectedReactNode() {
    const node = figma.currentPage.selection[0];
    const newNode = createUpdatedSceneNode(node);
    const reactNode = new ReactNativeNode(newNode)
    return reactNode;
}

