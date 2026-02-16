type AppHeaderProps = {
  onRefresh: () => void;
  onUpdateToday: () => void;
  loading: boolean;
  updateLoading: boolean;
  updateDisabled: boolean;
};

const AppHeader = ({
  onRefresh,
  onUpdateToday,
  loading,
  updateLoading,
  updateDisabled,
}: AppHeaderProps) => {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Input Boost</p>
        <h3>Learning with Input</h3>
        <p className="subtitle">오늘, 기억해야 할 단어에 집중하세요.</p>
      </div>
      <div className="header-actions">
        <button
          type="button"
          className="btn ghost"
          onClick={onRefresh}
          disabled={loading}
        >
          새로고침
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={onUpdateToday}
          disabled={updateLoading || updateDisabled}
        >
          오늘의 단어 가져오기
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
