import { ColorTranslator } from 'colortranslator';

export function toHsl(hex: string): string  {
    if (hex.length > 0) {
        const colorTranslator = new ColorTranslator(hex);
        const cmyValues = colorTranslator.HSLObject;

        // Regular expression to extract CMYK percentage values
        const roundedH = Math.round(cmyValues.H)
        const roundedS = Math.round(cmyValues.S)
        const roundedL = Math.round(cmyValues.L)

        return `${roundedH}, ${roundedS}, ${roundedL}`;

    }
    return ' ';
}
