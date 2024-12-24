import { FigmaNode } from "../../figma/nodes";
import { ImageProps, ImportType, TextProps, Tree } from "../../figma/types";

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
    return `<${tag} style={styles.${group.node.id}}>${views.join(
      "\n"
    )}</${tag}>`;
  };

  switch (tree.node.type) {
    case "Image":
      // eslint-disable-next-line no-case-declarations
      const imageProps = tree.node.props as ImageProps;
      return `<Image
                          style={styles.${tree.node.id}}
                          source={require('${imageProps.src}')}
                          resizeMode={'${imageProps.resizeMode}'}
                      />`;
    case "Text":
      // eslint-disable-next-line no-case-declarations
      const textProps = tree.node.props as TextProps;
      return `<Text style={styles.${tree.node.id}}>{'${textProps.text}'}</Text>`;

    case "Button":
      return createGroup(tree, "TouchableOpacity");
    default:
      return createGroup(tree, "View");
  }
};

function getImports(tree: Tree): ImportType[] {
  let imports = tree.node.imports ?? [];
  if (tree.children) {
    for (const child of tree.children) {
      imports = [...imports, ...getImports(child)];
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
        return `import { ${groupedImports[k].join(", ")} } from '${k}'`;
      });

    return `import { View, StyleSheet, ${groupedImports["react-native"].join(
      ", "
    )} } from 'react-native';\n
    import React from 'react';\n
    ${otherImports.join("\n")}
    `;
  }

  createComponent() {
    const imports = this.createImports();
    const body = `const ${this.getName()} = () => {
            return (
                <View>
                    ${this.createJSXNodes()}
                </View>
            )
        }`;
    const stylesheet = this.createStylesheet();
    const exportStr = `export default ${this.getName()};`;
    return `${imports}\n${body}\n${stylesheet}\n\n${exportStr}`;
  }

  private createStylesheet() {
    const array = createStyleSheetArray(this.getTree());
    const styles = {};
    for (const style of array) {
      styles[style.id] = style.style;
    }

    const stylesString = `const styles = StyleSheet.create(
        ${JSON.stringify(styles, null, 2)}
        )`;
    return stylesString;
  }
}
