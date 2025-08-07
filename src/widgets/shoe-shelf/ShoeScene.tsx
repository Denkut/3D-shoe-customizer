import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { ShoeShopModel } from "./ShoeShopModel";

export function ShoeScene() {
  return (
    <Canvas shadows camera={{ position: [0, 2, 10], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <ShoeShopModel />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
