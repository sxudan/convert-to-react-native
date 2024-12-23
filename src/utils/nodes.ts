export const isIconNode = (node: SceneNode) => {
    return node.type === 'INSTANCE' && node.children.length === 1 && node.children[0].type === 'VECTOR';
}

export const isImageNode = (node: SceneNode) => {
    if (node.type === 'RECTANGLE') {
        if (Array.isArray(node.fills) && node.fills.length > 0) {
            return node.fills[0].type === 'IMAGE';
        }
    }
    return false;
}

export const isVideoNode = (node: SceneNode) => {
    if (node.type === 'RECTANGLE') {
        if (Array.isArray(node.fills) && node.fills.length > 0) {
            return node.fills[0].type === 'VIDEO';
        }
    }
    return false;
}