import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCustomizeStore } from "@/features/customize-shoe/useCustomizeStore";
import { PART_MAPPING, ShoePart } from "@/app/constants";

export function ShoeShopModel() {
  const basePath = import.meta.env.BASE_URL;
  const modelPath = `${basePath}assets/shoe-shop-scene.glb`;
  const { scene } = useGLTF(modelPath);
  const { setSelectedMesh, setEditableParts, setCurrentPart } =
    useCustomizeStore();
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);
  const [, setSelectedMeshState] = useState<THREE.Mesh | null>(null);
  const previousSelectedRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (scene) {
      const clone = scene.clone(true);
      clone.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const parentName = obj.parent?.name || "";
          const meshKey = `${parentName}_${obj.name}`;

          const [, model, size] = parentName.split("_");

          obj.userData = {
            ...obj.userData,
            meshKey,
            model,
            size,
            part: obj.name,
          };
        }
      });
      setClonedScene(clone);
    }
  }, [scene]);

  // Функция для сброса выделения
  const resetSelection = (mesh: THREE.Mesh) => {
    const meshKey = mesh.userData.meshKey;
    const confirmedColors = useCustomizeStore.getState().confirmedColors;

    mesh.parent?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const baseName =
          obj.name.split("_")[0] +
          (obj.name.includes("_") ? `_${obj.name.split("_")[1]}` : "");
        const part = PART_MAPPING[baseName];
        if (!part) return;

        const color = confirmedColors[`${meshKey}-${part}`] ?? "#ffffff";

        (obj.material as THREE.MeshStandardMaterial).color.set(color);
      }
    });
  };

  // Функция для установки выделения
  const setSelection = (mesh: THREE.Mesh) => {
    mesh.parent?.traverse((obj) => {
      if (obj instanceof THREE.Mesh && !obj.userData.originalColor) {
        const material = obj.material as THREE.MeshStandardMaterial;
        obj.userData.originalColor = material.color.getHexString();
      }
    });

    // Здесь вместо анимации сразу ставим белый цвет выделения
    mesh.parent?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const material = obj.material as THREE.MeshStandardMaterial;
        material.color.set("#ffffff"); // выделяем белым
      }
    });
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;

    if (
      !mesh.userData?.meshKey ||
      !mesh.userData?.model ||
      !mesh.userData?.part
    )
      return;

    const prevSelected = previousSelectedRef.current;

    if (prevSelected && prevSelected !== mesh) {
      // Сброс цвета выделения у предыдущего
      resetSelection(prevSelected);
    }

    // Устанавливаем новое выделение
    setSelectedMeshState(mesh);
    previousSelectedRef.current = mesh;

    const modelName =
      mesh.userData.model || mesh.parent?.name || mesh.userData.meshKey;

    setSelectedMesh(mesh, modelName as string);

    const parts: ShoePart[] = [];
    mesh.parent?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const baseName =
          obj.name.split("_")[0] +
          (obj.name.includes("_") ? `_${obj.name.split("_")[1]}` : "");
        const part = PART_MAPPING[baseName];
        if (part && !parts.includes(part)) {
          parts.push(part);
        }
      }
    });

    setEditableParts(parts);
    setCurrentPart(parts[0]);

    setSelection(mesh);
  };

  useEffect(() => {
    const { selectedMesh, confirmedColors, colorMap } =
      useCustomizeStore.getState();
    if (selectedMesh) {
      const meshKey = selectedMesh.userData.meshKey;
      selectedMesh.parent?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const baseName =
            obj.name.split("_")[0] +
            (obj.name.includes("_") ? `_${obj.name.split("_")[1]}` : "");
          const part = PART_MAPPING[baseName];
          if (!part) return;

          const color =
            colorMap[`${meshKey}-${part}`] ??
            confirmedColors[`${meshKey}-${part}`];

          if (color) {
            (obj.material as THREE.MeshStandardMaterial).color.set(color);
          } else {
            (obj.material as THREE.MeshStandardMaterial).color.set("#ffffff");
          }
        }
      });
    }
  }, [
    useCustomizeStore((s) => s.confirmedColors),
    useCustomizeStore((s) => s.colorMap),
  ]);

  if (!clonedScene) return null;

  return (
    <primitive
      object={clonedScene}
      onPointerDown={handlePointerDown}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        document.body.style.cursor = (e.object as any).userData?.meshKey
          ? "pointer"
          : "default";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    />
  );
}
