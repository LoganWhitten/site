"use client";

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Float } from '@react-three/drei';

function Model(props: any) {
  const { scene } = useGLTF('/3d/scene.gltf');
  return <primitive object={scene} {...props} />;
}

function Loader({ setLoaded }: { setLoaded: (v: boolean) => void }) {
  useEffect(() => {
    setLoaded(true);
    return () => setLoaded(false);
  }, [setLoaded]);
  return null;
}

export default function LightbulbScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      height: '200px',
      width: '100%',
      background: 'transparent',
      opacity: loaded ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
    }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model position={[0, -4, 0]} scale={10} />
          </Float>
          <OrbitControls enableZoom={false} autoRotate />
          <Environment preset="city" />
          <Loader setLoaded={setLoaded} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/3d/scene.gltf');