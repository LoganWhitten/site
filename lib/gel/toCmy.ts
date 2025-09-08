import { ColorTranslator } from 'colortranslator';

export function toCmy(hex: string): string  {
    if (hex.length > 0) {
        const colorTranslator = new ColorTranslator(hex);
        const cmyValues = colorTranslator.CMYKObject;

        // Regular expression to extract CMYK percentage values
        const roundedC = Math.round(cmyValues.C)
        const roundedM = Math.round(cmyValues.M)
        const roundedY = Math.round(cmyValues.Y)

        return `${roundedC}, ${roundedM}, ${roundedY}`;

    }
    return ' ';
}
