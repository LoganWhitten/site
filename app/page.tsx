"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paintbrush } from "lucide-react";

function makeDeeperColor(color: string): string {
  const threeColor = new THREE.Color(color);

  // Multiply RGB values by 0.7 to make it deeper/darker
  threeColor.r *= 0.7;
  threeColor.g *= 0.7;
  threeColor.b *= 0.7;

  return "#" + threeColor.getHexString();
}

// Convert hex color to HTML color name if possible
function hexToColorName(hex: string): string {
  const colorMap: { [key: string]: string } = {
    "#f0f8ff": "aliceblue",
    "#faebd7": "antiquewhite",
    "#00ffff": "aqua",
    "#7fffd4": "aquamarine",
    "#f0ffff": "azure",
    "#f5f5dc": "beige",
    "#ffe4c4": "bisque",
    "#000000": "black",
    "#0000ff": "blue",
    "#8a2be2": "blueviolet",
    "#a52a2a": "brown",
    "#deb887": "burlywood",
    "#5f9ea0": "cadetblue",
    "#7fff00": "chartreuse",
    "#d2691e": "chocolate",
    "#ff7f50": "coral",
    "#6495ed": "cornflowerblue",
    "#fff8dc": "cornsilk",
    "#dc143c": "crimson",
    "#00008b": "darkblue",
    "#008b8b": "darkcyan",
    "#b8860b": "darkgoldenrod",
    "#a9a9a9": "darkgray",
    "#006400": "darkgreen",
    "#bdb76b": "darkkhaki",
    "#8b008b": "darkmagenta",
    "#556b2f": "darkolivegreen",
    "#ff8c00": "darkorange",
    "#9932cc": "darkorchid",
    "#8b0000": "darkred",
    "#e9967a": "darksalmon",
    "#8fbc8f": "darkseagreen",
    "#483d8b": "darkslateblue",
    "#2f4f4f": "darkslategray",
    "#00ced1": "darkturquoise",
    "#9400d3": "darkviolet",
    "#ff1493": "deeppink",
    "#00bfff": "deepskyblue",
    "#696969": "dimgray",
    "#1e90ff": "dodgerblue",
    "#b22222": "firebrick",
    "#fffaf0": "floralwhite",
    "#228b22": "forestgreen",
    "#ff00ff": "fuchsia",
    "#dcdcdc": "gainsboro",
    "#f8f8ff": "ghostwhite",
    "#ffd700": "gold",
    "#daa520": "goldenrod",
    "#808080": "gray",
    "#008000": "green",
    "#adff2f": "greenyellow",
    "#f0fff0": "honeydew",
    "#ff69b4": "hotpink",
    "#cd5c5c": "indianred",
    "#4b0082": "indigo",
    "#fffff0": "ivory",
    "#f0e68c": "khaki",
    "#e6e6fa": "lavender",
    "#fff0f5": "lavenderblush",
    "#7cfc00": "lawngreen",
    "#fffacd": "lemonchiffon",
    "#add8e6": "lightblue",
    "#f08080": "lightcoral",
    "#e0ffff": "lightcyan",
    "#fafad2": "lightgoldenrodyellow",
    "#d3d3d3": "lightgray",
    "#90ee90": "lightgreen",
    "#ffb6c1": "lightpink",
    "#ffa07a": "lightsalmon",
    "#20b2aa": "lightseagreen",
    "#87cefa": "lightskyblue",
    "#778899": "lightslategray",
    "#b0c4de": "lightsteelblue",
    "#ffffe0": "lightyellow",
    "#00ff00": "lime",
    "#32cd32": "limegreen",
    "#faf0e6": "linen",
    "#800000": "maroon",
    "#66cdaa": "mediumaquamarine",
    "#0000cd": "mediumblue",
    "#ba55d3": "mediumorchid",
    "#9370db": "mediumpurple",
    "#3cb371": "mediumseagreen",
    "#7b68ee": "mediumslateblue",
    "#00fa9a": "mediumspringgreen",
    "#48d1cc": "mediumturquoise",
    "#c71585": "mediumvioletred",
    "#191970": "midnightblue",
    "#f5fffa": "mintcream",
    "#ffe4e1": "mistyrose",
    "#ffe4b5": "moccasin",
    "#ffdead": "navajowhite",
    "#000080": "navy",
    "#fdf5e6": "oldlace",
    "#808000": "olive",
    "#6b8e23": "olivedrab",
    "#ffa500": "orange",
    "#ff4500": "orangered",
    "#da70d6": "orchid",
    "#eee8aa": "palegoldenrod",
    "#98fb98": "palegreen",
    "#afeeee": "paleturquoise",
    "#db7093": "palevioletred",
    "#ffefd5": "papayawhip",
    "#ffdab9": "peachpuff",
    "#cd853f": "peru",
    "#ffc0cb": "pink",
    "#dda0dd": "plum",
    "#b0e0e6": "powderblue",
    "#800080": "purple",
    "#ff0000": "red",
    "#bc8f8f": "rosybrown",
    "#4169e1": "royalblue",
    "#8b4513": "saddlebrown",
    "#fa8072": "salmon",
    "#f4a460": "sandybrown",
    "#2e8b57": "seagreen",
    "#fff5ee": "seashell",
    "#a0522d": "sienna",
    "#c0c0c0": "silver",
    "#87ceeb": "skyblue",
    "#6a5acd": "slateblue",
    "#708090": "slategray",
    "#fffafa": "snow",
    "#00ff7f": "springgreen",
    "#4682b4": "steelblue",
    "#d2b48c": "tan",
    "#008080": "teal",
    "#d8bfd8": "thistle",
    "#ff6347": "tomato",
    "#40e0d0": "turquoise",
    "#ee82ee": "violet",
    "#f5deb3": "wheat",
    "#ffffff": "white",
    "#f5f5f5": "whitesmoke",
    "#ffff00": "yellow",
    "#9acd32": "yellowgreen",
  };

  return colorMap[hex.toLowerCase()] || hex;
}

function Model({ wallColor }: { wallColor: string }) {
  const { scene } = useGLTF("/3d/scene.gltf");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.material.name === "Part2Mtl.007") {
          child.material.color = new THREE.Color(wallColor);
          child.material.needsUpdate = true;
        }
        // Enable shadow receiving
        child.receiveShadow = true;
      }
    });
  }, [scene, wallColor]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

function ColorModal({
  isOpen,
  onClose,
  onSubmit,
  currentColorName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (color: string) => void;
  currentColorName: string;
}) {
  const [colorInput, setColorInput] = useState("");
  const [error, setError] = useState("");

  // Initialize input with current color when modal opens
  useEffect(() => {
    if (isOpen) {
      setColorInput(currentColorName);
      setError("");
    }
  }, [isOpen, currentColorName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const testElement = document.createElement("div");
    testElement.style.color = colorInput;

    if (testElement.style.color !== "") {
      onSubmit(colorInput);
      setColorInput("");
      setError("");
      onClose();
    } else {
      setError("Please enter a valid color");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-2xl rounded-lg shadow-xl max-w-md w-full pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-3">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Your Favorite Color
              </h2>
              <p className="text-sm text-neutral-500">
                Name a color, gel, or any code you can think of.
              </p>
            </div>

            {/* Input */}
            <div>
              <Input
                type="text"
                value={colorInput}
                onChange={(e) => {
                  setColorInput(e.target.value);
                  setError("");
                }}
                autoFocus
              />

              {error && (
                <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                  {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function GoboLight({ texture }: { texture: THREE.Texture }) {
  const lightRef = useRef<THREE.SpotLight>(null!);

  useEffect(() => {
    if (lightRef.current && texture) {
      // Configure the spotlight
      lightRef.current.castShadow = true;
      lightRef.current.shadow.mapSize.width = 2048;
      lightRef.current.shadow.mapSize.height = 2048;
      lightRef.current.shadow.camera.near = 1;
      lightRef.current.shadow.camera.far = 30;
      lightRef.current.shadow.camera.fov = 60;
      
      // Set the gobo texture as the light's map (cookie/gobo)
      lightRef.current.map = texture;
      lightRef.current.map.needsUpdate = true;
    }
  }, [texture]);

  return (
    <spotLight
      ref={lightRef}
      position={[0, 28.5, 12]}
      target-position={[0,0,0]}
      angle={Math.PI / 5}
      penumbra={0.15}
      intensity={550}
      color="white"
      distance={100}
    />
  );
}

export default function Home() {
  const [wallColor, setWallColor] = useState(makeDeeperColor("blue"));
  const [originalColorName, setOriginalColorName] = useState("blue");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goboTexture, setGoboTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/3d/textures/rosco-venetian-window-standard-steel-gobo-pattern-77139-24.jpg",
      (texture) => {
        setGoboTexture(texture);
      }
    );
  }, []);

  const handleColorSubmit = (color: string) => {
    const deeperColor = makeDeeperColor(color);
    setWallColor(deeperColor);
    setOriginalColorName(color);
  };

  return (
    <div className="w-screen h-screen bg-black relative">
      <Canvas shadows camera={{ position: [-30, 10, -25], fov: 50 }}>
        <Suspense fallback={null}>
          <Model wallColor={wallColor} />
          <ambientLight color={'blue'} intensity={0.2} />
          <OrbitControls target={[0, -5, 0]} />
          {goboTexture && <GoboLight texture={goboTexture} />}
        </Suspense>
      </Canvas>

      {/* Paint Palette Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-white text-black p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group"
        aria-label="Change wall color"
      >
        <Paintbrush className="w-5 h-5" />
      </button>

      {/* Color Modal */}
      <ColorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleColorSubmit}
        currentColorName={originalColorName}
      />
    </div>
  );
}
