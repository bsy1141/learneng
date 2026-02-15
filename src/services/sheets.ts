export type VocabEntry = {
  word: string;
  meaning: string;
  example?: string;
  tags?: string[];
  level?: string;
  status?: string;
  lastReviewed?: string;
  nextReview?: string;
};

type RawRow = string[];

type SheetResponse = {
  values?: RawRow[];
};

const headerMap: Record<string, keyof VocabEntry> = {
  "단어 (Word)": "word",
  "의미 (Meaning)": "meaning",
  "예문 (Example)": "example",
  "태그 (Tags)": "tags",
  "학습 상태 (Status)": "status",
};

const mapRows = (rows: RawRow[]): VocabEntry[] => {
  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => {
    return headerMap[header] || null;
  });

  return rows.slice(1).map((row) => {
    const entry: VocabEntry = {
      word: "",
      meaning: "",
      example: "",
      tags: [],
      level: "",
      status: "",
    };

    row.forEach((cell, index) => {
      const key = headers[index];
      if (!key) return;

      if (key === "tags") {
        entry.tags = cell
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        return;
      }

      entry[key] = cell;
    });

    if (!entry.word) {
      entry.word = row[0] || "";
    }

    if (!entry.meaning) {
      entry.meaning = row[1] || "";
    }

    return entry;
  });
};

const getConfig = () => {
  const sheetId = import.meta.env.VITE_SHEET_ID as string | undefined;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;

  if (!sheetId || !apiKey) {
    throw new Error(
      "VITE_SHEET_ID 또는 VITE_GOOGLE_API_KEY가 설정되지 않았습니다.",
    );
  }

  return { sheetId, apiKey };
};

export const fetchSheet = async (sheetName: string): Promise<VocabEntry[]> => {
  const { sheetId, apiKey } = getConfig();
  const range = encodeURIComponent(`${sheetName}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("시트를 불러오는 중 오류가 발생했습니다.");
  }

  const data = (await response.json()) as SheetResponse;
  return mapRows(data.values ?? []);
};

type ReviewPayload = {
  word: string;
  meaning: string;
  example?: string;
  tags?: string[];
  level?: string;
  lastReviewed?: string;
  nextReview?: string;
};

type StatusPayload = {
  word: string;
  status: string;
};

export const addToReview = async (payload: ReviewPayload) => {
  const response = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sheet: "Review",
      row: payload,
    }),
  });

  if (!response.ok) {
    throw new Error("복습 시트에 추가하는 중 오류가 발생했습니다.");
  }

  return (await response.json()) as { ok?: boolean };
};

export const updateTodayStatus = async (payload: StatusPayload) => {
  const response = await fetch("/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sheet: "Today",
      word: payload.word,
      status: payload.status,
    }),
  });

  if (!response.ok) {
    throw new Error("학습 상태를 업데이트하는 중 오류가 발생했습니다.");
  }

  return (await response.json()) as { ok?: boolean };
};
