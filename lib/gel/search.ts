import { cmykToHex } from './toHex';
import gels from '../../public/gels.json';


export function searchForGel(gel: string) {
    //take in a gel name as a string
    let lowercaseGel = gel.toLowerCase();
    //if the second character is 0 remove it
    if (lowercaseGel[1] === "0") {
        lowercaseGel = lowercaseGel[0] + lowercaseGel.slice(2);
    }
    //search /public/gels.json for the gel name
    const foundGel = gels.ColorPalette.ColorList.C.find((color) => color.N.toLowerCase() === lowercaseGel);
    //return the gel color in hex
    if (foundGel != null) {
        //turn comma seperated string into array
        const cmyk = foundGel.D.split(",");
        const c: number = Number(cmyk[0]);
        const m: number = Number(cmyk[1]);
        const y: number = Number(cmyk[2]);
        const k: number = Number(cmyk[3]);
        const hex = cmykToHex((c), (m), (y), (k));
        return hex;
    } else {
        return ('')
    }
}