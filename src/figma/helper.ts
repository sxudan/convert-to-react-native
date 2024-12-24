export function colorToHex(
  color: { r: number; g: number; b: number },
  opacity: number
): string {
  const { r, g, b } = color;

  // Scale to 0-255 and convert to hex
  const rHex = Math.round(r * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round(g * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round(b * 255)
    .toString(16)
    .padStart(2, "0");
  const opacityHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  // Combine into a single hex color
  return `#${rHex}${gHex}${bHex}${opacityHex}`;
}

export function convertToId(input: string): string {
  // Replace all colons and semicolons with a single hyphen
  return input.replace(/[:;]/g, "_");
}

export function normalizeToComponentName(input: string): string {
    // Remove invalid characters and split into words
    const words = input
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric and non-space characters
      .trim() // Remove leading and trailing whitespace
      .split(/\s+/); // Split by whitespace
  
    // Capitalize each word
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  
    // Join words and ensure it starts with a valid letter
    const normalizedName = capitalizedWords.join("");
  
    // Ensure the name starts with a valid character (e.g., a letter)
    return /^[a-zA-Z]/.test(normalizedName) ? normalizedName : `Component${normalizedName}`;
  }
