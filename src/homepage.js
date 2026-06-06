const favoriteColor = "R32"
document.getElementById('ColorInput').textContent = favoriteColor;
function fetchJSONData(url, colorinput) {
  const cachedData = localStorage.getItem(url);
  if (cachedData) {
    return colorParse(colorinput, JSON.parse(cachedData));
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
      colorParse(colorinput, data["ColorPalette"]["ColorList"]["C"]);
    })
    .catch((error) => console.error("Failed to fetch data:", error));
}

function colorParse(Color, gels) {
  for (let index = 0; index < gels.length; index++) {
    const element = gels[index];
    if (element["N"] == Color) {
      const cmyk = element["D"];
      const colorTexts = document.getElementsByTagName("ColorText");
      const c = cmyk.slice(0, 8);
      const m = cmyk.slice(9, 17);
      const y = cmyk.slice(18, 26);
      const k = cmyk.slice(27);
      const pronoun = document.getElementById("pronoun");

      for (let i = 0; i < colorTexts.length; i++) {
        const rgb = convertCMYKtoRGB(c, m, y, k);
        colorTexts[i].style.color = rgb;
      }
      break;
    }
  }
}
function convertCMYKtoRGB(c, m, y, k) {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return `rgb(${r},${g},${b})`;
}

const colorInput = document.getElementById("ColorInput");
colorInput.addEventListener("input", () => {
  const text = colorInput.textContent;
  if (text.toUpperCase() != favoriteColor) {
    pronoun.textContent = "Your";
  } else {
    pronoun.textContent = "My";
  }

  if (text.length > 6) {
    colorInput.textContent = text.substring(0, text.length - 1);
  } else {
    data = fetchJSONData(
      "./public/gels.json",
      colorInput.textContent.toUpperCase(),
    );
  }
});

fetchJSONData(
      "./public/gels.json",
      colorInput.textContent.toUpperCase(),
    );