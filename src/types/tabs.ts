export type TabKey = "today" | "review";

export type TabConfig = {
  key: TabKey;
  label: string;
  sheet: string;
};

export const TAB_CONFIG: TabConfig[] = [
  {
    key: "today",
    label: "오늘 학습",
    sheet: import.meta.env.VITE_SHEET_TODAY || "Today",
  },
  {
    key: "review",
    label: "복습",
    sheet: import.meta.env.VITE_SHEET_REVIEW || "Review",
  },
];
