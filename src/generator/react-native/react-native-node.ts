import { FigmaNode } from "../../figma/nodes";
import { ImageProps, ImportType, TextProps, Tree } from "../../figma/types";
import { generateSVGCode } from "./react-native-svg";

export const createStyleSheetArray = (tree: Tree) => {
  let styles = [{ id: tree.node.id, style: tree.node.styles }];
  if (tree.children) {
    for (const child of tree.children) {
      styles = [...styles, ...createStyleSheetArray(child)];
    }
  }
  return styles;
};

const createJSXNode = (tree: Tree) => {
  const createGroup = (group: Tree, tag: string) => {
    if ((tree.children ?? []).length === 0) {
      return `<${tag} style={styles.${group.node.id}} />`;
    }
    // eslint-disable-next-line no-case-declarations
    const views: string[] = [];
    for (const child of group.children ?? []) {
      const node = createJSXNode(child);
      views.push(node);
    }
    return `<${tag} style={styles.${group.node.id}}>\n${views.join(
      "\n"
    )}\n</${tag}>\n`;
  };

  switch (tree.node.type) {
    case "Image":
      // eslint-disable-next-line no-case-declarations
      const imageProps = tree.node.props as ImageProps;
      return `<Image
                  style={styles.${tree.node.id}}
                  source={require('${imageProps.src}')}
                  resizeMode={'${imageProps.resizeMode}'}
              />\n`;
    case "Text":
      // eslint-disable-next-line no-case-declarations
      const textProps = tree.node.props as TextProps;
      return `<Text style={styles.${tree.node.id}}>{'${textProps.text}'}</Text>\n`;

    case "Button":
      return createGroup(tree, "TouchableOpacity");
    case "Icon":
      return generateSVGCode(tree.node);
    default:
      return createGroup(tree, "View");
  }
};

function getImports(tree: Tree) {
  let imports = tree.node.imports ?? [];
  if (tree.children) {
    for (const child of tree.children) {
      const childImports = Array.from(getImports(child));
      imports = Array.from(new Set([...imports, ...childImports]));
    }
  }
  return imports;
}

export class ReactNativeNode extends FigmaNode {
  private createJSXNodes() {
    return createJSXNode(this.getTree());
  }

  private createImports() {
    const defaultImports: ImportType[] = [{ outside: "React", from: "react-native" }, { inside: "View", from: "react-native" }, { inside: "StyleSheet", from: "react-native" }, { inside: "TouchableOpacity", from: "react-native" }];
    const imports = [...getImports(this.getTree()), ...defaultImports];
    // Group by the `from` property
    const grouped: Record<string, { inside: Set<string>; outside: Set<string> }> = {};
  
    imports.forEach((imp) => {
      const { inside, outside, from } = imp;
  
      if (!grouped[from]) {
        grouped[from] = { inside: new Set(), outside: new Set() };
      }
  
      if (inside) grouped[from].inside.add(inside);
      if (outside) grouped[from].outside.add(outside);
    });
  
    // Create formatted import strings
    const result = Object.entries(grouped).map(([from, { inside, outside }]) => {
      const insidePart = [...inside].length > 0 ? `{ ${[...inside].join(", ")} }` : "";
      const outsidePart = [...outside].join(", ");
      const combined = [outsidePart, insidePart].filter(Boolean).join(", ");
  
      return `import ${combined} from '${from}';`;
    });
  
    return result.join("\n");
  }

  async createComponent() {
    const imports = this.createImports();
    const body = `const ${this.getName()} = () => {
            return (
                <View>
                    ${this.createJSXNodes()}
                </View>
            );
        }`;
    const stylesheet = this.createStylesheet();
    const exportStr = `export default ${this.getName()};`;
    const code = `${imports}\n${body}\n\n${stylesheet}\n\n${exportStr}`;
    return code;
  }

  private createStylesheet() {
    const array = createStyleSheetArray(this.getTree()) ?? [];
    const styles = {};
    for (const style of array) {
      styles[style.id] = style.style;
    }

    const stylesString = `const styles = StyleSheet.create(${JSON.stringify(styles, null, 2)});\n`;
    return stylesString;
  }
}
