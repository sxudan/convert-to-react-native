import { isImageNode } from "./nodes";
import { getPaintProps } from "./paint";
import { getPosition } from "./positions"

export const getProperty = async (node: SceneNode) => {
    let textProps = {};
    let shapeProps = {};
    if (node.type === 'TEXT') {
        textProps = {
            fontSize: node.fontSize,
            characters: node.characters,
            textAlign: node.textAlignHorizontal,
            lineHeight: node.lineHeight,
            letterSpacing: node.letterSpacing,
            fills: node.fills,
        }
    } else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
        const shape = node as RectangleNode | EllipseNode;
        shapeProps = {
            fills: Array.isArray(shape.fills) ? await Promise.all(shape.fills.map(fill => getPaintProps(fill))) : undefined,
            strokes: shape.strokes,

        }
    }
    return {
        position: getPosition(node),
        opacity: 'opacity' in node ? node.opacity : undefined,
        textProps,
        name: node.name,
        type: node.type,
        id: node.id,
        isAsset: node.isAsset,
        isVisible: node.visible,
        shapeProps,
        isImage: isImageNode(node)
    }
}