import { ShoePart, SHOE_PARTS } from "@/app/constants";

export const defaultColorMap: Record<ShoePart, string> = SHOE_PARTS.reduce(
  (o, p) => ({ ...o, [p]: "#ffffff" }),
  {} as Record<ShoePart, string>
);

export const defaultConfirmedParts: Record<ShoePart, boolean> =
  SHOE_PARTS.reduce(
    (o, p) => ({ ...o, [p]: false }),
    {} as Record<ShoePart, boolean>
  );
