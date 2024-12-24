export interface Position {
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
  ],
  ["Text"]: ["TEXT"],
  Icon: ["VECTOR"],
  Input: ["BOOLEAN_OPERATION"],
};

export interface Appearance {
  opacity?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderStyle?: string;
  shadowColor?: string;
  shadowOffset?: { x: number; y: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
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
    width: number;
    height: number;
}

export interface ImageProps {
    src: string;
    resizeMode: "cover" | "contain" | "stretch" | "repeat" | "center";
}

export interface TextProps { text: string }

export interface DSL {
  id: string;
  name: string;
  type: ComponentType;
  position: Position;
  styles: Appearance & Partial<TypographyStyles> & Partial<DimensionStyles>;
  props: { [key: string]: any };
  imports: ImportType[];
}

export interface Tree {
  children?: Tree[];
  node: DSL;
}


export interface ImportType {
    name: string;
    from: string;
}