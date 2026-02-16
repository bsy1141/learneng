import { useEffect, useMemo } from "react";
import AppHeader from "./components/AppHeader";
import EmptyState from "./components/EmptyState";
import { FlashcardContainer } from "./components/Flashcard";
import Panel from "./components/Panel";
import StatusBar from "./components/StatusBar";
import TabBar from "./components/TabBar";
import {
  selectVisibleList,
  useAppStore,
} from "./stores/useAppStore";
import { TAB_CONFIG } from "./types/tabs";

const App = () => {
  const {
    activeTab,
    data,
    loading,
    error,
    addMessage,
    updateLoading,
    updateDisabled,
    setActiveTab,
    loadSheet,
    refreshActive,
    updateToday,
  } = useAppStore();

  const currentList = useMemo(
    () => selectVisibleList(data, activeTab),
    [data, activeTab],
  );

  const currentSheetName =
    TAB_CONFIG.find((tab) => tab.key === activeTab)?.sheet ?? "Today";

  useEffect(() => {
    loadSheet(activeTab);
  }, [activeTab, loadSheet]);

  useEffect(() => {
    loadSheet("review");
  }, [loadSheet]);

  return (
    <div className="app">
      <AppHeader
        onRefresh={refreshActive}
        onUpdateToday={updateToday}
        loading={loading}
        updateLoading={updateLoading}
        updateDisabled={updateDisabled}
      />

      <TabBar tabs={TAB_CONFIG} activeKey={activeTab} onChange={setActiveTab} />

      <main>
        <StatusBar sheetName={currentSheetName} count={currentList.length} />

        {loading && <Panel>단어를 불러오는 중...</Panel>}
        {error && !loading && <Panel variant="error">{error}</Panel>}
        {addMessage && !loading && <Panel>{addMessage}</Panel>}

        {!loading && !error && currentList.length === 0 && <EmptyState />}

        {!loading && !error && currentList.length > 0 && <FlashcardContainer />}
      </main>

      <footer className="app-footer">
        <span>Google Spreadsheets 기반</span>
        <span>AI 예문 생성</span>
      </footer>
    </div>
  );
};

export default App;
