import { Options } from 'prettier';


export const config = {
    prettierConfig: {
        parser: 'typescript', // Specify the parser (e.g., "babel", "typescript", "html", etc.)
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 4,
      } as Options
}