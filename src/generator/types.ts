export interface CodeGenerateType {
    name: string;
    styles: { [key: string]: string | number | undefined | null };
    imports: string[];
    code: string[]
}