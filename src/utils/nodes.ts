
export const isIconNode = (node: SceneNode) => {
  return (
    node.type === "INSTANCE" &&
    node.children.length === 1 &&
    node.children[0].type === "VECTOR"
  );
};

export const isImageNode = (node: SceneNode) => {
  if (node.type === "RECTANGLE") {
    if (Array.isArray(node.fills) && node.fills.length > 0) {
      return node.fills[0].type === "IMAGE";
    }
  }
  return false;
};

export const isButton = (node: SceneNode) => {
    const buttonTypes = ["RECTANGLE", "ELLIPSE", "TEXT", "INSTANCE", "GROUP"];
    if (buttonTypes.includes(node.type) && node.name.toLowerCase().includes('button')) {
        return true;
    }
    return false;
}

export const isVideoNode = (node: SceneNode) => {
  if (node.type === "RECTANGLE") {
    if (Array.isArray(node.fills) && node.fills.length > 0) {
      return node.fills[0].type === "VIDEO";
    }
  }
  return false;
};

export const isScreen = (node: SceneNode) => {
    return node.parent.type === "PAGE";
}

export const isVector = (node: SceneNode) => {
    return node.type === "VECTOR";
}