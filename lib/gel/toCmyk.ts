import { ColorTranslator } from 'colortranslator';

export function toCmyk(hex: string): string  {
    if (hex.length > 0) {
        const colorTranslator = new ColorTranslator(hex);
        const cmykValues = colorTranslator.CMYKObject;

        // Regular expression to extract CMYK percentage values
        const roundedC = Math.round(cmykValues.C)
        const roundedM = Math.round(cmykValues.M)
        const roundedY = Math.round(cmykValues.Y)
        const roundedK = Math.round(cmykValues.K)

        return `${roundedC}, ${roundedM}, ${roundedY}, ${roundedK}`;

    }
    return ' ';
}
