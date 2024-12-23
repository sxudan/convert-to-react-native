import { NodePosition } from "./positions";
import { getProperty } from "./properties";
import { NodeStyle } from "./styles";

type CustomNode = {
  node: SceneNode;
  children?: CustomNode[];
  info?: {
    isAsset: boolean;
    isVisible: boolean;
    position?: NodePosition;
    styles?: NodeStyle;
  } & {[key: string]: unknown};
};

export const crawl = async (node: SceneNode): Promise<CustomNode> => {
  const styles: NodeStyle | undefined = await node.getCSSAsync();

  const info = {
    styles: styles,
    ...await getProperty(node),
  };


  switch (node.type) {
    case "FRAME":
    case "GROUP":
    case "COMPONENT":
      return {
        node,
        children: await Promise.all((node.children as SceneNode[]).map(crawl)),
        info,
      };
    case "VECTOR":
      return { node, info: {...info, vectorData: (node as VectorNode).vectorPaths} };
    case "INSTANCE":
      return {
        node,
        children: await Promise.all((node.children as SceneNode[]).map(crawl)),
        info,
      };
    default:
      return { node, info };
  }
};
