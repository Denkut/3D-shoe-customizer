import { ColorPicker, Paper, Title } from "@mantine/core";
import { useCustomizeStore } from "./useCustomizeStore";
import { useEffect, useState } from "react";
import * as THREE from "three";

export function CustomizePanel() {
  const selected = useCustomizeStore((state) => state.selected);
  const [color, setColor] = useState(
    selected && selected.material instanceof THREE.MeshStandardMaterial
      ? selected.material.color.getStyle()
      : "#aaaaaa"
  );

  const isValidMaterial = (
    material: unknown
  ): material is THREE.MeshStandardMaterial =>
    material instanceof THREE.MeshStandardMaterial;

  useEffect(() => {
    if (selected && isValidMaterial(selected.material)) {
      const current = selected.material.color.getStyle();
      setColor(current);
    }
    return () => {
      // Очистка, если нужно
    };
  }, [selected]);

  const handleColorChange = (val: string) => {
    setColor(val);
    if (selected && isValidMaterial(selected.material)) {
      selected.material.color.set(val);
    }
  };

  if (!selected) return null;

  return (
    <Paper
      shadow="md"
      radius="md"
      p="md"
      style={{ position: "absolute", bottom: 20, left: 20, zIndex: 10 }}
    >
      <Title order={5}>Кастомизация</Title>
      <ColorPicker value={color} onChange={handleColorChange} format="hex" />
    </Paper>
  );
}
