import { useEffect, useMemo, useState } from "react";
import Flashcard from "./components/Flashcard";
import { fetchSheet, type VocabEntry } from "./services/sheets";
import { generateExample } from "./services/ai";

type TabKey = "today" | "review" | "master";

type TabConfig = {
  key: TabKey;
  label: string;
  sheet: string;
};

const TAB_CONFIG: TabConfig[] = [
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
  {
    key: "master",
    label: "전체",
    sheet: import.meta.env.VITE_SHEET_MASTER || "Master",
  },
];

const initialData: Record<TabKey, VocabEntry[]> = {
  today: [],
  review: [],
  master: [],
};

const App = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [aiExample, setAiExample] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const currentSheetName = useMemo(
    () => TAB_CONFIG.find((tab) => tab.key === activeTab)?.sheet ?? "Today",
    [activeTab],
  );

  const currentList = data[activeTab];
  const currentEntry = currentList[index];

  const resetCardState = () => {
    setFlipped(false);
    setAiExample(null);
  };

  const loadSheet = async (tabKey: TabKey, force = false) => {
    if (!force && data[tabKey].length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const sheetName =
        TAB_CONFIG.find((tab) => tab.key === tabKey)?.sheet ?? "Today";
      const rows = await fetchSheet(sheetName);
      setData((prev) => ({ ...prev, [tabKey]: rows }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "불러오기에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheet(activeTab);
    setIndex(0);
    resetCardState();
  }, [activeTab]);

  const handlePrev = () => {
    if (currentList.length === 0) return;
    resetCardState();
    setIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
  };

  const handleNext = () => {
    if (currentList.length === 0) return;
    resetCardState();
    setIndex((prev) => (prev + 1) % currentList.length);
  };

  const handleGenerateExample = async () => {
    if (!currentEntry?.word) return;
    setAiLoading(true);
    setAiExample(null);

    try {
      const sentence = await generateExample(
        currentEntry.word,
        currentEntry.meaning,
      );
      setAiExample(sentence);
    } catch (err) {
      const message = err instanceof Error ? err.message : "예문 생성 실패";
      setAiExample(message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Input Boost</p>
          <h3>Learning with Input</h3>
          <p className="subtitle">오늘, 기억해야 할 단어에 집중하세요.</p>
        </div>
        <button
          type="button"
          className="btn ghost"
          onClick={() => loadSheet(activeTab, true)}
          disabled={loading}
        >
          새로고침
        </button>
      </header>

      <nav className="tab-bar">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${tab.key === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        <section className="status-bar">
          <div>
            <p className="status-title">현재 시트</p>
            <p className="status-value">{currentSheetName}</p>
          </div>
          <div>
            <p className="status-title">단어 수</p>
            <p className="status-value">{currentList.length}</p>
          </div>
        </section>

        {loading && <div className="panel">단어를 불러오는 중...</div>}
        {error && !loading && <div className="panel error">{error}</div>}

        {!loading && !error && currentList.length === 0 && (
          <div className="panel">
            <p>표에 단어가 없습니다.</p>
            <p className="panel-subtext">스프레드시트에 단어를 추가해주세요.</p>
          </div>
        )}

        {!loading && !error && currentEntry && (
          <Flashcard
            entry={currentEntry}
            flipped={flipped}
            onToggle={() => setFlipped((prev) => !prev)}
            onPrev={handlePrev}
            onNext={handleNext}
            onGenerateExample={handleGenerateExample}
            aiExample={aiExample}
            aiLoading={aiLoading}
            index={index}
            total={currentList.length}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>Google Spreadsheets 기반</span>
        <span>AI 예문 생성</span>
      </footer>
    </div>
  );
};

export default App;
