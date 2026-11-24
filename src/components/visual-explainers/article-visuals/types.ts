export type Source = { label: string; url: string; supports: string };
export type Item = { title: string; text: string; cue?: string };
export type Matrix = { kind: "matrix"; columns: string[]; rows: { title: string; cells: string[] }[] };
export type Sequence = { kind: "sequence"; steps: Item[]; outcomes?: Item[]; outcomeLabel?: string };
export type Branch = { kind: "branch"; root: string; branches: Item[] };
export type Breakdown = { kind: "breakdown"; billed: number; allowed: number; deductible: number; rate: number };
export type Visual = {
  title: string;
  takeaway: string;
  scope: string;
  diagram: Matrix | Sequence | Branch | Breakdown;
  check: string;
  sources: Source[];
};
