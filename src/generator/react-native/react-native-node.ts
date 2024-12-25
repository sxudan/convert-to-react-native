import { FigmaNode } from "../../figma/nodes";
import { ImageProps, TextProps, Tree } from "../../figma/types";
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
      console.log('imports', imports)
    }
  }
  return imports;
}

export class ReactNativeNode extends FigmaNode {
  private createJSXNodes() {
    return createJSXNode(this.getTree());
  }

  private createImports() {
    const imports = getImports(this.getTree());
    
    const groupedImports = imports.reduce((acc, cur) => {
      if (!acc[cur.from]) {
        acc[cur.from] = [];
      }
      acc[cur.from].push(cur.name);
      return acc;
    }, {});

    const otherImports = Object.keys(groupedImports)
      .filter((k) => k !== "react-native")
      .map((k) => {
        return `import ${groupedImports[k].join(", ")} from '${k}';`;
      });
      

    const nativeImports = (groupedImports["react-native"] ?? []).join(
      ", "
    )

    console.log(nativeImports)
    return `import { View, StyleSheet, ${nativeImports} } from 'react-native';\nimport React from 'react';\n
    ${otherImports.join("\n")}
    `;
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
