import { ColorTranslator } from 'colortranslator';

export function toRgb(hex: string): string {
    if (hex.length > 0) {
        const colorTranslator = new ColorTranslator(hex);
        const rgbString = colorTranslator.RGBObject;
        // Use a regular expression to extract the percentage values
        const roundedR = Math.round((rgbString.R / 255) * (100))
        const roundedG = Math.round((rgbString.G / 255) * (100))
        const roundedB = Math.round((rgbString.B / 255) * (100))
            // Convert the percentage strings to numbers
            return `${roundedR}, ${roundedG}, ${roundedB}`;
    }
    return ' ';
}
