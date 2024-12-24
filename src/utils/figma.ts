export async function getSelectedComponent(): Promise<ComponentNode> {
  const { selection } = figma.currentPage;
  if (selection.length === 0) return null;
  const components = await getComponents(selection);
  return components.length > 0 ? components[0] : null;
}

export async function getComponents(
  nodes: readonly SceneNode[]
): Promise<ComponentNode[]> {
  const components: ComponentNode[] = [];
  for (const node of nodes) {
    const component = await getComponent(node);
    if (component) {
      components.push(component);
    }
  }
  return components;
}

// Find the component of a node (if exists)
export async function getComponent(
  node: SceneNode
): Promise<ComponentNode | null> {
  // Find the component in the parent chain
  let target: SceneNode = node;
  while (
    target.type !== "COMPONENT_SET" &&
    target.type !== "COMPONENT" &&
    target.type !== "INSTANCE" &&
    target.parent &&
    target.parent.type !== "PAGE"
  ) {
    target = target.parent as SceneNode;
  }
  // If the target is a component set, use the default variant
  if (target.type === "COMPONENT_SET") return target.defaultVariant;
  // If the target is an instance, use the main component
  if (target.type === "INSTANCE") return await target.getMainComponentAsync();
  // If the target is a variant, use the default variant
  if (target.type === "COMPONENT")
    return target?.parent.type === "COMPONENT_SET"
      ? target.parent.defaultVariant
      : target;
  // Return null otherwise
  return null;
}

export function getTag(type: string) {
  switch (type) {
    case "TEXT":
      return "Text";
    case "IMAGE":
      return "Image";
    case "VECTOR":
      return "Svg";
    default:
      return "View";
  }
}

export function getName(value, skipPrefix) {
  const safe = value.replace(/[^a-zA-Z0-9$]+/g, "");
  if (!skipPrefix && !isNaN(parseInt(safe))) {
    return "$" + safe;
  } else {
    return safe;
  }
}
