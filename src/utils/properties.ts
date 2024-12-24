import { isButton, isImageNode, isScreen, isVector, isVideoNode } from "./nodes";
import { getPaintProps } from "./paint";
import { getPosition } from "./positions"

export const getProperty = async (node: SceneNode) => {
    let textProps = {};
    let shapeProps = {};
    let svgData = {};
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
    } else if (node.type === 'VECTOR') {
        svgData = {
            vectorPaths: (node as VectorNode).vectorPaths,
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
        isImage: isImageNode(node),
        isVideo: isVideoNode(node),
        isButton: isButton(node),
        isScreen: isScreen(node),
        isVector: isVector(node),
        svgData,
    }
}