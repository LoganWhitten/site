function fetchJSONData(colorinput: string, setColor: Function) {
  const url = "/gels.json";

  const cachedData = localStorage.getItem(url);
  if (cachedData) {
    return colorParse(colorinput, JSON.parse(cachedData), setColor);
  }
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem(
        url,
        JSON.stringify(data["ColorPalette"]["ColorList"]["C"]),
      );
      colorParse(colorinput, data["ColorPalette"]["ColorList"]["C"], setColor);
    })
    .catch((error) => console.error("Failed to fetch data:", error));
}

function colorParse(Color: string, gels: any[], setColor: Function) {
  for (let index = 0; index < gels.length; index++) {
    const element = gels[index];
    if (element["N"] == Color) {
      const cmyk = element["D"];
      const c = cmyk.slice(0, 8);
      const m = cmyk.slice(9, 17);
      const y = cmyk.slice(18, 26);
      const k = cmyk.slice(27);
      const rgb = convertCMYKtoRGB(c, m, y, k);
      setColor(rgb);
      break;
    }
  }
}
function convertCMYKtoRGB(c: number, m: number, y: number, k: number) {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  console.log(`rgb(${r},${g},${b})`);
  return `rgb(${r},${g},${b})`;
}

export { fetchJSONData, colorParse, convertCMYKtoRGB };
