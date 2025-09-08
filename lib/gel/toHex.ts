export function cmykToHex(c: number, m: number, y: number, k: number) {
    if (c.toLocaleString().length > 0) {
        // Convert CMYK to RGB first
        let r = 255 * (1 - c) * (1 - k);
        let g = 255 * (1 - m) * (1 - k);
        let b = 255 * (1 - y) * (1 - k);

        // Convert RGB to HEX
        let hex = (1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
        return '#' + hex.toString(16).slice(1).toUpperCase();
    }
    else { return ' ' }
}
