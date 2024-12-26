import { colorToHex, convertToId, normalizeToComponentName } from "./helper";
import {
  Appearance,
  ComponentType,
  DSL,
  ImageProps,
  ImportType,
  mappedNodeType,
  Dimension,
  TextProps,
  Tree,
  TypographyStyles,
  TypographyStylesTextStyles,
  VectorProps,
} from "./types";

export function createUpdatedSceneNode(node: SceneNode): SceneNode {
  if ('children' in node === false) {
    return node;
  }
  // Create a new frame to hold the updated structure
  const newFrame = figma.createFrame();
  newFrame.resizeWithoutConstraints(1000, 1000); // Set default size, can be adjusted as needed
  newFrame.name = `${node.name}_UpdatedStructure`;

  // Collect all children of the provided node and group them into rows
  const groupedRows: SceneNode[][] = groupIntoRows(node);

  // Offset for arranging rows
  let yOffset = 0;

  groupedRows.forEach((row, rowIndex) => {
    // Clone each node in the row
    const clonedRow = row.map((childNode) => {
      const clonedNode = childNode.clone();
      // Adjust parent structure of the cloned node
      figma.currentPage.appendChild(createUpdatedSceneNode(clonedNode));
      return clonedNode;
    });

    if (clonedRow.length === 1) {
      const r = clonedRow[0];
      r.name = `Row_${rowIndex + 1}${r.id}`;
      newFrame.appendChild(r);
    } else {
      // // Group the cloned row
      const rowGroup = figma.group(clonedRow, figma.currentPage);
      rowGroup.name = `Row_${rowIndex + 1}`;
      rowGroup.x = 0; // Align all rows to the left
      rowGroup.y = yOffset; // Position rows sequentially

      // Update offset for the next row
      yOffset += rowGroup.height + 20; // Add 20px spacing between rows

      // Append the grouped row to the new frame
      newFrame.appendChild(rowGroup);
    }
  });

  return newFrame;
}

/**
 * Groups the children of a node into rows based on their Y-coordinates.
 */

function groupIntoRows(parentNode: SceneNode): SceneNode[][] {
  if (!("children" in parentNode)) {
    return [];
  }

  // Clone and sort children by `y` to group rows vertically
  const children = parentNode.children.map((child) => child.clone()).sort((a, b) => a.y - b.y);

  const rows: SceneNode[][] = [];
  const rowThreshold = 10; // Threshold for determining a new row

  let currentRow: SceneNode[] = [];
  let previousY = children[0]?.y ?? 0;

  children.forEach((child) => {
    const childY = child.y;

    // Start a new row if `y` difference exceeds the threshold
    if (Math.abs(childY - previousY) > rowThreshold) {
      // Sort the current row based on `x` before pushing
      currentRow.sort((a, b) => a.x - b.x);
      rows.push(currentRow);

      currentRow = [];
    }

    // Add the child to the current row
    currentRow.push(child);
    previousY = childY;
  });

  // Add the last row if not empty
  if (currentRow.length > 0) {
    currentRow.sort((a, b) => a.x - b.x); // Sort the last row based on `x`
    rows.push(currentRow);
  }

  // Ensure no overlapping within each row
  rows.forEach((row) => {
    let previousChild: SceneNode | null = null;

    row.forEach((child) => {
      if (previousChild && "x" in previousChild && "width" in previousChild) {
        const previousX = previousChild.x;
        const previousWidth = "width" in previousChild ? previousChild.width : 0;

        // Adjust the current child's position if overlapping
        if ("x" in child && child.x < previousX + previousWidth) {
          child.x = previousX + previousWidth + 10; // Add 10px spacing
        }
      }

      previousChild = child;
    });
  });

  return rows;
}

function appearance(node: SceneNode): Appearance {
  const value: Appearance = {
    opacity: undefined,
    borderRadius: undefined,
    // >>>>>> border
    borderTopLeftRadius: undefined,
    borderTopRightRadius: undefined,
    borderBottomLeftRadius: undefined,
    borderBottomRightRadius: undefined,

    backgroundColor: undefined,
    borderColor: undefined,
    borderWidth: undefined,
    borderTopWidth: undefined,
    borderRightWidth: undefined,
    borderBottomWidth: undefined,
    borderLeftWidth: undefined,
    borderStyle: undefined,
    // >>>>>> shadow
    shadowColor: undefined,
    shadowOffset: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    // Android Shadow
    elevation: undefined,
    // dimention
    position: undefined,
    width: undefined,
    height: undefined,
  };

  if (node.parent && node.parent.type !== "PAGE") {
    if (
      node.width === (node.parent as SceneNode).width &&
      node.height === (node.parent as SceneNode).height
    ) {
      value.position = "absolute";
      value.width = "100%";
      value.height = "100%";
    }
  }

  if (node.name.toLowerCase().includes("row")) {
    value.flexDirection = "row";
  }

  if ("opacity" in node) {
    value.opacity = node.opacity;
  }

  if ("cornerRadius" in node) {
    value.borderRadius =
      typeof node.cornerRadius === "number"
        ? Number(node.cornerRadius)
        : undefined;

    if (node.type === "ELLIPSE") {
      value.borderRadius = node.width / 2;
    }
  }

  if ("topLeftRadius" in node) {
    value.borderTopLeftRadius = node.topLeftRadius;
  }

  if ("topRightRadius" in node) {
    value.borderTopRightRadius = node.topRightRadius;
  }

  if ("bottomLeftRadius" in node) {
    value.borderBottomLeftRadius = node.bottomLeftRadius;
  }

  if ("bottomRightRadius" in node) {
    value.borderBottomRightRadius = node.bottomRightRadius;
  }

  if (
    node.type !== "TEXT" &&
    node.type !== "VECTOR" &&
    "fills" in node &&
    Array.isArray(node.fills) &&
    node.fills.length > 0
  ) {
    const fill = node.fills[0] as Paint;
    if (fill.type === "SOLID" && fill.visible) {
      value.backgroundColor = colorToHex(fill.color, fill.opacity);
    }
  }
  if (
    "strokes" in node &&
    Array.isArray(node.strokes) &&
    node.strokes.length > 0
  ) {
    const stroke = node.strokes[0] as Paint;
    if (stroke.type === "SOLID" && stroke.visible) {
      value.borderColor = colorToHex(stroke.color, stroke.opacity);
    }

    if ("strokeWeight" in node) {
      value.borderWidth =
        typeof node.strokeWeight === "number"
          ? Number(node.strokeWeight)
          : undefined;
    }

    if ("strokeTopWeight" in node) {
      value.borderTopWidth = node.strokeTopWeight;
    }

    if ("strokeRightWeight" in node) {
      value.borderRightWidth = node.strokeRightWeight;
    }

    if ("strokeBottomWeight" in node) {
      value.borderBottomWidth = node.strokeBottomWeight;
    }

    if ("strokeLeftWeight" in node) {
      value.borderLeftWidth = node.strokeLeftWeight;
    }

    if ("dashPattern" in node) {
      value.borderStyle = node.dashPattern.length > 0 ? "dashed" : "solid";
    }
  }

  if (
    "effects" in node &&
    Array.isArray(node.effects) &&
    node.effects.length > 0 &&
    node.effects[0].visible
  ) {
    if (node.effects[0].type === "DROP_SHADOW") {
      const shadow = node.effects[0] as DropShadowEffect;
      value.shadowColor = colorToHex(
        { r: shadow.color.r, g: shadow.color.g, b: shadow.color.b },
        shadow.color.a
      );
      value.shadowOffset = {
        width: shadow.offset.x,
        height: shadow.offset.y,
      };
      value.shadowRadius = shadow.radius;
      value.shadowOpacity = 1;
      value.elevation = shadow.radius;
    }
  }

  const allKeys = Object.keys(value);

  allKeys.forEach((key) => {
    if (value[key] === undefined) {
      delete value[key];
    }

    if (
      value.borderLeftWidth === value.borderWidth &&
      value.borderBottomWidth === value.borderWidth &&
      value.borderRightWidth === value.borderWidth &&
      value.borderTopWidth === value.borderWidth
    ) {
      delete value.borderLeftWidth;
      delete value.borderBottomWidth;
      delete value.borderRightWidth;
      delete value.borderTopWidth;
    }

    if (
      value.borderTopLeftRadius === value.borderRadius &&
      value.borderTopRightRadius === value.borderRadius &&
      value.borderBottomLeftRadius === value.borderRadius &&
      value.borderBottomRightRadius === value.borderRadius
    ) {
      delete value.borderTopLeftRadius;
      delete value.borderTopRightRadius;
      delete value.borderBottomLeftRadius;
      delete value.borderBottomRightRadius;
    }
  });

  return value;
}

// TODO: Implement alignment
function alignment(node: SceneNode) {
  if (node.type === "INSTANCE") {
    console.log(node.layoutAlign);
  }
}

function getVectorProperties(node: SceneNode) {
  let vecNode = node;
  let props: VectorProps = {
    fill: "#000",
  };

  if (node.isAsset && node.type === "FRAME") {
    vecNode = node.children.filter((child) => child.type === "VECTOR")[0];
    const styles = new FigmaNode(vecNode).getAppearance();
    props = {
      fill: styles.backgroundColor,
    };
  }

  if (vecNode.type === "VECTOR") {
    const vectorData = vecNode.vectorPaths;
    return {
      vectorData,
      props,
    };
  }
  return null;
}

function imageProperties(node: SceneNode) {
  if ("fills" in node && Array.isArray(node.fills) && node.fills.length > 0) {
    let fill = node.fills[0] as Paint;
    if (fill.type === "IMAGE" && fill.visible) {
      fill = fill as ImagePaint;
      let resizeMode = "cover";
      switch (fill.scaleMode) {
        case "FILL":
          resizeMode = "stretch";
          break;
        case "FIT":
          resizeMode = "contain";
          break;
        case "CROP":
          resizeMode = "cover";
          break;
        case "TILE":
          resizeMode = "repeat";
          break;
        default:
          resizeMode = "cover";
          break;
      }
      return {
        props: {
          src: fill.imageHash,
          resizeMode,
        } as ImageProps,
        styles: {
          opacity: fill.opacity,
        },
      };
    }
  }
}

function typography(node: SceneNode): {
  styles: TypographyStyles | null;
  props: TextProps;
} {
  if (node.type === "TEXT") {
    const lineHeight = node.lineHeight as LineHeight;
    const letterSpacing = node.letterSpacing as LetterSpacing;
    const fontSize =
      typeof node.fontSize === "number"
        ? node.fontSize
        : Number(node.fontSize["value"]);
    const lineHeightValue =
      lineHeight.unit === "PIXELS"
        ? lineHeight.value
        : lineHeight.unit === "PERCENT"
          ? fontSize * lineHeight.value
          : undefined;
    const letterSpacingValue =
      letterSpacing.unit === "PIXELS"
        ? letterSpacing.value
        : letterSpacing.unit === "PERCENT"
          ? fontSize * letterSpacing.value
          : undefined;
    const fontWeight =
      typeof node.fontWeight === "number" ? node.fontWeight : undefined;

    let textAlign: TypographyStylesTextStyles = "left";
    switch (node.textAlignHorizontal) {
      case "CENTER":
        textAlign = "center";
        break;
      case "RIGHT":
        textAlign = "right";
        break;
      case "JUSTIFIED":
        textAlign = "justify";
        break;
      default:
        textAlign = "auto";
        break;
    }
    const textProperties = {
      textAlign,
      fontSize: fontSize,
      fontFamily: (node.fontName as FontName).family,
      fontWeight: fontWeight,
      lineHeight: lineHeightValue,
      letterSpacing: letterSpacingValue ? letterSpacingValue : undefined,
      color:
        Array.isArray(node.fills) && node.fills.length > 0
          ? colorToHex(node.fills[0].color, node.fills[0].opacity)
          : undefined,
    };
    const allKeys = Object.keys(textProperties);

    allKeys.forEach((key) => {
      if (textProperties[key] === undefined) {
        delete textProperties[key];
      }
    });
    return {
      styles: textProperties,
      props: {
        text: node.characters,
      },
    };
  } else {
    return null;
  }
}

export class FigmaNode {
  node: SceneNode;

  constructor(node: SceneNode) {
    this.node = node;
  }

  isNodeVisible() {
    return this.node.visible;
  }

  getId() {
    return `generated_${this.getName()}_${convertToId(this.node.id)}`;
  }

  getName() {
    return normalizeToComponentName(this.node.name);
  }

  isLeafNode() {
    return "children" in this.node ? this.node.children.length === 0 : true;
  }

  getDimension(): Dimension {
    return {
      x: this.node.x,
      y: this.node.y,
      width: this.node.width,
      height: this.node.height,
    };
  }

  getChildren(): FigmaNode[] {
    if (this.getComponentType() === "Icon") {
      return [];
    }
    if ("children" in this.node) {
      return this.node.children.map((child) => new FigmaNode(child));
    }
    return [];
  }

  getTree(): Tree {
    const tree = {
      children: null,
      node: this.generateDSL(),
    };

    if (!this.isLeafNode() && this.getComponentType() !== "Icon") {
      for (const child of this.getChildren()) {
        if (tree.children === null) {
          tree.children = [];
        }
        tree.children.push({
          children:
            child.isLeafNode() || child.getComponentType() === "Icon"
              ? null
              : [...child.getTree().children],
          node: child.generateDSL(),
        });
      }
    }
    return tree;
  }

  getComponentType(): ComponentType {
    if (this.node.isAsset && "fills" in this.node) {
      if (
        this.node.fills &&
        Array.isArray(this.node.fills) &&
        this.node.fills.length > 0
      ) {
        const fill = this.node.fills[0];
        if (fill.type === "IMAGE") {
          return "Image";
        } else if (fill.type === "VIDEO") {
          return "Video";
        }
      }
    }

    if (this.node.isAsset && this.node.type === "FRAME") {
      const hasVector = this.node.children.some(
        (child) => child.type === "VECTOR"
      );
      if (hasVector) {
        return "Icon";
      }
    }

    if (this.node.name.toLowerCase().includes("button")) {
      return "Button";
    }

    const type = Object.keys(mappedNodeType).find((key) =>
      mappedNodeType[key].includes(this.node.type)
    ) as ComponentType;
    return type;
  }

  getAppearance(): Appearance {
    return appearance(this.node);
  }

  generateDSL(): DSL {
    const type = this.getComponentType();
    const name = this.getName();
    const appearance = this.getAppearance();
    const dimension = this.getDimension();
    const id = this.getId();
    const props = {};
    const imports: ImportType[] = [];
    const vectorData = null;

    const dsl = {
      id,
      name,
      type,
      styles: {
        ...appearance,
      },
      dimension,
      props,
      imports,
      vectorData,
    };

    if (type === "Image") {
      const imagePropery = imageProperties(this.node);
      return {
        ...dsl,
        styles: {
          ...dsl.styles,
          ...imagePropery.styles,
        },
        props: {
          ...dsl.props,
          ...imagePropery.props,
        },
        imports: [...dsl.imports, { inside: "Image", from: "react-native" }],
      };
    } else if (type === "Text") {
      const textProp = typography(this.node);
      return {
        ...dsl,
        styles: {
          ...dsl.styles,
          ...textProp.styles,
        },
        props: {
          ...dsl.props,
          ...textProp.props,
        },
        imports: [...dsl.imports, { inside: "Text", from: "react-native" }],
      };
    } else if (type === "Button") {
      return {
        ...dsl,
        styles: {
          ...dsl.styles,
          height: dsl.dimension.height,
          width: dsl.dimension.width,
          justifyContent: "center",
          alignItems: "center",
        },
        imports: [
          ...dsl.imports,
          { inside: "TouchableOpacity", from: "react-native" },
        ],
      };
    } else if (type === "Icon") {
      const { vectorData, props } = getVectorProperties(this.node);
      return {
        ...dsl,
        vectorData: vectorData,
        imports: [
          ...dsl.imports,
          { outside: "Svg", inside: "Path", from: "react-native-svg" },
        ],
        props: {
          ...dsl.props,
          ...props,
        },
      };
    }

    return dsl;
  }
}
