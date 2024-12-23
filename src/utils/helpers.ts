// export const normalizeCssString = (css: string) => {
//   const endingString = ";";
//   return css + (css.includes(endingString) ? "" : endingString);
// };

// export const combineCssString = (a: string, b?: string) => {
//   if (!b) {
//     return a;
//   }
//   return a + "\n" + normalizeCssString(b);
// };

// export const extractColorFromSolidPaint = (paint: SolidPaint) => {
//   const { color, opacity } = paint;
//   const hex = rgbaToHex(color, opacity);
//   if (paint.visible === false) {
//     return `transparent`;
//   }
//   return `${hex}`;
// };

// export const generateCssFromSceneNode = (node: SceneNode) => {
//   return `
//     left: ${node.x};
//     top: ${node.y};
//     width: ${node.width}px;
//     height: ${node.height}px;
//   `;
// };

// export function generateCSSForRectangle(
//   node: RectangleNode | EllipseNode
// ): string {
//   const stroke = node.strokes[0] as SolidPaint | null | undefined;

//   const bg = Array.isArray(node.fills)
//     ? (node.fills[0] as SolidPaint | null | undefined)
//     : null;
//   let css = ``;
//   if (stroke) {
//     const borderWidth = node.strokeWeight as number;
//     css = combineCssString(
//       css,
//       `border-color: ${extractColorFromSolidPaint(stroke)};`
//     );
//     css = combineCssString(css, `border-width: ${borderWidth}px;`);
//   }

//   if (bg) {
//     css = combineCssString(
//       css,
//       `background-color: ${extractColorFromSolidPaint(bg)};`
//     );
//   }

//   if (node.cornerRadius) {
//     css = combineCssString(
//       css,
//       `border-radius: ${node.cornerRadius as number}px;`
//     );
//   }

//   return css;
// }

// export const generateCSSForText = (node: TextNode) => {
//   const font = node.fontName as FontName;
//   const css = `
//       font-family: '${font.family}';
//       font-size: ${node.fontSize as number}px;
//       color: ${
//         Array.isArray(node.fills)
//           ? rgbaToHex(
//               node.fills[0].color || { r: 0, g: 0, b: 0, a: 1 },
//               node.opacity
//             )
//           : "black"
//       };
//       font-weight: ${node.fontWeight as number};
//       text-align: ${node.textAlignVertical.toLowerCase()};
//     `;

//   return css;
// };

// export const generateCSSForInstance = (node: InstanceNode) => {
//   const css = ``;
//   return css;
// };

// export function getCSSFromNode(node: SceneNode): string {
//     let css = generateCssFromSceneNode(node);
//   if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
//     css = combineCssString(css, generateCSSForRectangle(node));
//   } else if (node.type === "TEXT") {
//     css = combineCssString(css, generateCSSForText(node));
//   } else if (node.type === 'INSTANCE') {
//     css = combineCssString(css, generateCSSForInstance(node));
//   } else {
//     // return "Unsupported node type";
//   }
//   return css.trim().replace(/\s{2}/g, '').replace('/\n/g', '');
// }

// export function rgbaToHex(color: RGB, opacity: number = 1): string {
//   const r = Math.round(color.r * 255);
//   const g = Math.round(color.g * 255);
//   const b = Math.round(color.b * 255);
//   const a = Math.round(opacity * 255);

//   // Convert to hex and ensure two digits with padding
//   const hexR = r.toString(16).padStart(2, "0");
//   const hexG = g.toString(16).padStart(2, "0");
//   const hexB = b.toString(16).padStart(2, "0");
//   const hexA = a.toString(16).padStart(2, "0");

//   // Return hex string with alpha
//   return `#${hexR}${hexG}${hexB}${opacity < 1 ? hexA : ""}`;
// }
