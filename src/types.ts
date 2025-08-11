export type Cell = {
  text: string;
  checked: boolean;
};
export type Column = [Cell, Cell, Cell, Cell, Cell];

export const ColumnKeys = ["b", "i", "n", "g", "o"] as const;

export type BingoCard = [Column, Column, Column, Column, Column];
