export interface StripoMergetagEntry {
  label: string;
  value: string;
  hint?: string;
  hidden?: boolean;
}
export interface StripoMergeTag {
  category: string;
  entries: StripoMergetagEntry[];
}
