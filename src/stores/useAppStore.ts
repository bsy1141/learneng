import { create } from "zustand";
import { generateExample } from "../services/ai";
import {
  addToReview,
  deleteRowByWord,
  fetchSheet,
  type VocabEntry,
  updateTodayStatus,
} from "../services/sheets";
import { TAB_CONFIG, type TabKey } from "../types/tabs";
import { isDoneStatus } from "../utils/status";

type AppState = {
  activeTab: TabKey;
  data: Record<TabKey, VocabEntry[]>;
  loading: boolean;
  error: string | null;
  index: number;
  flipped: boolean;
  aiExample: string | null;
  aiLoading: boolean;
  addLoading: boolean;
  addMessage: string | null;
  doneLoading: boolean;
  updateLoading: boolean;
  updateDisabled: boolean;
};

type AppActions = {
  setActiveTab: (tab: TabKey) => void;
  loadSheet: (tabKey: TabKey, force?: boolean) => Promise<void>;
  refreshActive: () => Promise<void>;
  prevCard: (total: number) => void;
  nextCard: (total: number) => void;
  toggleFlip: () => void;
  resetCardState: () => void;
  generateExample: (entry: VocabEntry) => Promise<void>;
  addReviewEntry: (entry: VocabEntry) => Promise<void>;
  markDone: (entry: VocabEntry) => Promise<void>;
  updateToday: () => Promise<void>;
  setIndex: (index: number) => void;
};

const initialData: Record<TabKey, VocabEntry[]> = {
  today: [],
  review: [],
};

const getSheetName = (tabKey: TabKey) => {
  return TAB_CONFIG.find((tab) => tab.key === tabKey)?.sheet ?? "Today";
};

const getDateParts = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const parseDateParts = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const ymdMatch = trimmed.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
  if (ymdMatch) {
    return {
      year: Number(ymdMatch[1]),
      month: Number(ymdMatch[2]),
      day: Number(ymdMatch[3]),
    };
  }

  const mdyMatch = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (mdyMatch) {
    return {
      year: Number(mdyMatch[3]),
      month: Number(mdyMatch[1]),
      day: Number(mdyMatch[2]),
    };
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return getDateParts(parsed);
};

const isToday = (value?: string | null) => {
  const parts = parseDateParts(value);
  if (!parts) return false;

  const today = getDateParts(new Date());
  return (
    parts.year === today.year &&
    parts.month === today.month &&
    parts.day === today.day
  );
};

const shouldDisableUpdate = (entries: VocabEntry[]) => {
  if (entries.length === 0) return false;
  return entries.every((entry) => isToday(entry.nextReview));
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  activeTab: "today",
  data: initialData,
  loading: false,
  error: null,
  index: 0,
  flipped: false,
  aiExample: null,
  aiLoading: false,
  addLoading: false,
  addMessage: null,
  doneLoading: false,
  updateLoading: false,
  updateDisabled: false,
  setActiveTab: (tab) => {
    set({
      activeTab: tab,
      index: 0,
      flipped: false,
      aiExample: null,
      addMessage: null,
    });
  },
  loadSheet: async (tabKey, force = false) => {
    const { data } = get();
    if (!force && data[tabKey].length > 0) return;

    set({ loading: true, error: null });

    try {
      const sheetName = getSheetName(tabKey);
      const rows = await fetchSheet(sheetName);
      set((state) => ({
        data: { ...state.data, [tabKey]: rows },
        updateDisabled:
          tabKey === "today" ? shouldDisableUpdate(rows) : state.updateDisabled,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "불러오기에 실패했습니다.";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  refreshActive: async () => {
    const { activeTab } = get();
    await get().loadSheet(activeTab, true);
    if (activeTab !== "today") {
      await get().loadSheet("today", true);
    }
  },
  prevCard: (total) => {
    if (total === 0) return;
    set((state) => ({
      flipped: false,
      index: (state.index - 1 + total) % total,
      aiExample: null,
      addMessage: null,
    }));
  },
  nextCard: (total) => {
    if (total === 0) return;
    set((state) => ({
      flipped: false,
      index: (state.index + 1) % total,
      aiExample: null,
      addMessage: null,
    }));
  },
  toggleFlip: () => set((state) => ({ flipped: !state.flipped })),
  resetCardState: () =>
    set({ flipped: false, aiExample: null, addMessage: null }),
  generateExample: async (entry) => {
    if (!entry.word) return;
    set({ aiLoading: true, aiExample: null });

    try {
      const sentence = await generateExample(entry.word, entry.meaning);
      set({ aiExample: sentence });
    } catch (err) {
      const message = err instanceof Error ? err.message : "예문 생성 실패";
      set({ aiExample: message });
    } finally {
      set({ aiLoading: false });
    }
  },
  addReviewEntry: async (entry) => {
    const { activeTab } = get();
    if (activeTab !== "today") return;

    set({ addLoading: true, addMessage: null });

    try {
      await addToReview({
        word: entry.word,
        meaning: entry.meaning,
        example: entry.example,
        tags: entry.tags,
        level: entry.level,
      });

      set((state) => ({
        data: { ...state.data, review: [...state.data.review, entry] },
        addMessage: "복습 탭에 추가되었습니다.",
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "복습에 추가 실패";
      set({ addMessage: message });
    } finally {
      set({ addLoading: false });
    }
  },
  markDone: async (entry) => {
    const { activeTab } = get();

    set({ doneLoading: true, addMessage: null });

    try {
      if (activeTab === "review") {
        await deleteRowByWord({ sheet: "Review", word: entry.word });
        set((state) => ({
          data: {
            ...state.data,
            review: state.data.review.filter(
              (item) => item.word !== entry.word,
            ),
          },
          index: 0,
          addMessage: "복습 탭에서 삭제되었습니다.",
        }));
      } else {
        await updateTodayStatus({ word: entry.word, status: "done" });
        set((state) => ({
          data: {
            ...state.data,
            today: state.data.today.map((item) =>
              item.word === entry.word ? { ...item, status: "done" } : item,
            ),
          },
          index: 0,
          addMessage: "학습 완료로 표시되었습니다.",
        }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "학습 완료 처리 실패";
      set({ addMessage: message });
    } finally {
      set({ doneLoading: false });
    }
  },
  updateToday: async () => {
    set({ updateLoading: true, updateDisabled: true, addMessage: null });

    try {
      const response = await fetch("http://localhost:5678/webhook-test/update", {
        method: "POST",
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "오늘의 단어 요청 실패");
      }

      set({ addMessage: "오늘의 단어 요청을 보냈습니다." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "오늘의 단어 요청 실패";
      set({ addMessage: message, updateDisabled: false });
    } finally {
      set({ updateLoading: false });
    }
  },
  setIndex: (index) => set({ index }),
}));

export const selectVisibleList = (
  data: Record<TabKey, VocabEntry[]>,
  activeTab: TabKey,
) => {
  if (activeTab !== "today") return data[activeTab];
  return data.today.filter((entry) => !isDoneStatus(entry.status));
};

export const selectReviewWordSet = (review: VocabEntry[]) => {
  return new Set(review.map((entry) => entry.word.trim().toLowerCase()));
};
