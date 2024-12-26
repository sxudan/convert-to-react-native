export interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ComponentType =
  | "View"
  | "Text"
  | "Image"
  | "Icon"
  | "Button"
  | "Video"
  | "Input";

export const mappedNodeType: { [key in ComponentType]?: NodeType[] } = {
  ["View"]: [
    "FRAME",
    "RECTANGLE",
    "ELLIPSE",
    "POLYGON",
    "STAR",
    "COMPONENT",
    "INSTANCE",
    "GROUP",
  ],
  ["Text"]: ["TEXT"],
  Icon: ["VECTOR"],
  Input: ["BOOLEAN_OPERATION"],
};

export interface Appearance extends DimensionStyles {
  opacity?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderStyle?: string;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
  position?: "absolute" | "relative";
  flexDirection?: "row" | "column";
}

export type TypographyStylesTextStyles =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "auto";

export interface TypographyStyles {
  textAlign: TypographyStylesTextStyles;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | symbol;
  lineHeight: number;
  letterSpacing: number;
  color: string;
}

export interface DimensionStyles {
    width?: number | string;
    height?: number | string;
}

export interface ImageProps {
    src: string;
    resizeMode: "cover" | "contain" | "stretch" | "repeat" | "center";
}

export interface TextProps { text: string }

export interface VectorProps {
  fill: string;
}

export interface AlignmentStyles {
  justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around";
  alignItems: "center" | "flex-start" | "flex-end" | "stretch";
}

export interface DSL {
  id: string;
  name: string;
  type: ComponentType;
  dimension: Dimension;
  styles: Appearance & Partial<TypographyStyles> & Partial<DimensionStyles> & Partial<AlignmentStyles>;
  props: { [key: string]: any };
  imports: ImportType[];
  vectorData?: VectorPaths;
}

export interface Tree {
  children?: Tree[];
  node: DSL;
}


export interface ImportType {
    outside?: string;
    inside?: string;
    from: string;
}