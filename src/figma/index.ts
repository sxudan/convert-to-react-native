import { ReactNativeNode } from "../generator/react-native/react-native-node";

export function getSelectedReactNode() {
    const node = figma.currentPage.selection[0];
    const reactNode = new ReactNativeNode(node)
    console.log(node.exportAsync())
    return reactNode;
}

