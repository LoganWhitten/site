"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

function makeDeeperColor(color: string): string {
  const threeColor = new THREE.Color(color);

  // Multiply RGB values by 0.6 to make it deeper/darker
  threeColor.r *= 0.7;
  threeColor.g *= 0.7;
  threeColor.b *= 0.7;

  return "#" + threeColor.getHexString();
}

function Model({ wallColor }: { wallColor: string }) {
  const { scene } = useGLTF("/3d2/scene.gltf");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.material.name === "Part2Mtl.007") {
          child.material.color = new THREE.Color(wallColor);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, wallColor]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

function LoadingScreen({
  onColorSubmit,
}: {
  onColorSubmit: (color: string) => void;
}) {
  const [colorInput, setColorInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const testElement = document.createElement("div");
    testElement.style.color = colorInput;

    if (testElement.style.color !== "") {
      onColorSubmit(colorInput);
    } else {
      setError("Invalid color");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/20 z-50">
      <Card >
        <form onSubmit={handleSubmit} className="w-full max-w-sm gap-6">
          <CardHeader>What's Your Favorite Color?</CardHeader>

          <CardContent className="">
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
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
          </CardContent>
          <CardAction>
            <Button
              type="submit"
              className="w-full hover:bg-white/10 hover:outline cursor-pointer"
              variant="outline"
            >
              Continue
            </Button>
          </CardAction>
        </form>
      </Card>
    </div>
  );
}

export default function Home() {
  const [wallColor, setWallColor] = useState("#f0f0f0");
  const [isLoaded, setIsLoaded] = useState(false);

  const handleColorSubmit = (color: string) => {
    const deeperColor = makeDeeperColor(color);
    setWallColor(deeperColor);
    setIsLoaded(true);
  };

  return (
    <div className="w-screen h-screen">
      {!isLoaded && <LoadingScreen onColorSubmit={handleColorSubmit} />}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Model wallColor={wallColor} />
          <OrbitControls />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
