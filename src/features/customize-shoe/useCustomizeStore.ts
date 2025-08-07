import { create } from "zustand";
import * as THREE from "three";
import { ShoePart } from "@/app/constants";

interface CustomizeState {
  selectedMesh: THREE.Mesh | null;
  selectedModelName: string;
  editableParts: ShoePart[];
  currentPart: ShoePart;
  colorMap: Record<string, string>; // temp, live color
  confirmedColors: Record<string, string>; // final applied colors
  setSelectedMesh: (mesh: THREE.Mesh | null, modelName: string) => void;
  setEditableParts: (parts: ShoePart[]) => void;
  setCurrentPart: (part: ShoePart) => void;
  setColorForPart: (part: ShoePart, meshKey: string, color: string) => void;
  confirmColor: (meshKey: string) => void;
  resetAllForMesh: (meshKey: string) => void;
}

export const useCustomizeStore = create<CustomizeState>((set, get) => ({
  selectedMesh: null,
  selectedModelName: "",
  editableParts: [],
  currentPart: "mesh",
  colorMap: {},
  confirmedColors: {},

  setSelectedMesh(mesh, modelName) {
    set({ selectedMesh: mesh, selectedModelName: modelName });

    const meshKey = mesh?.userData.meshKey;
    const confirmed = get().confirmedColors;
    const partEntries = Object.entries(confirmed)
      .filter(([key]) => key.startsWith(meshKey))
      .reduce<Record<string, string>>((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
    set({ colorMap: partEntries }); // sync back to editable
  },

  setEditableParts(parts) {
    set({ editableParts: parts });
  },

  setCurrentPart(part) {
    set({ currentPart: part });
  },

  setColorForPart(part, meshKey, color) {
    const key = `${meshKey}-${part}`;
    const mesh = get().selectedMesh;
    mesh?.parent?.traverse((obj) => {
      if (
        obj instanceof THREE.Mesh &&
        obj.userData.meshKey === meshKey &&
        obj.userData.part === part
      ) {
        (obj.material as THREE.MeshStandardMaterial).color.set(color);
      }
    });

    set((state) => ({
      colorMap: {
        ...state.colorMap,
        [key]: color,
      },
    }));
  },

  confirmColor(meshKey) {
    const { colorMap, confirmedColors } = get();
    const entries = Object.entries(colorMap).filter(([k]) =>
      k.startsWith(meshKey)
    );
    const newConfirmed = Object.fromEntries(entries);
    set({
      confirmedColors: {
        ...confirmedColors,
        ...newConfirmed,
      },
    });
  },

  resetAllForMesh(meshKey) {
    set((state) => {
      const filteredColorMap = Object.fromEntries(
        Object.entries(state.colorMap).filter(([k]) => !k.startsWith(meshKey))
      );
      const filteredConfirmed = Object.fromEntries(
        Object.entries(state.confirmedColors).filter(
          ([k]) => !k.startsWith(meshKey)
        )
      );
      return {
        colorMap: filteredColorMap,
        confirmedColors: filteredConfirmed,
      };
    });
  },
}));
