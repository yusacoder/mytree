export const ORNAMENTS_PER_DISPLAY_TREE = 7;

export const ORNAMENT_TREE_POSITIONS = [
  { x: 42, y: 28 },
  { x: 58, y: 36 },
  { x: 35, y: 48 },
  { x: 65, y: 52 },
  { x: 50, y: 62 },
  { x: 28, y: 68 },
  { x: 72, y: 72 },
] as const;

export function getOrnamentTreePosition(index: number) {
  return ORNAMENT_TREE_POSITIONS[index % ORNAMENTS_PER_DISPLAY_TREE];
}
