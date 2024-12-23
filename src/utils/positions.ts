export type NodePosition = {
    x: number;
    y: number;
    width: number;
    height: number;
 }

export const getPosition = (node: SceneNode): NodePosition=> {
    return {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
    }
}