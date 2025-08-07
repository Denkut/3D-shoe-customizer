export const SHOE_PARTS = [
  "laces",
  "mesh",
  "caps",
  "inner",
  "sole",
  "stripes",
  "band",
  "patch",
] as const;

export type ShoePart = (typeof SHOE_PARTS)[number];
