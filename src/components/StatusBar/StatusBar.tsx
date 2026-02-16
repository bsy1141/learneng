type StatusBarProps = {
  sheetName: string;
  count: number;
};

const StatusBar = ({ sheetName, count }: StatusBarProps) => {
  return (
    <section className="status-bar">
      <div>
        <p className="status-title">현재 시트</p>
        <p className="status-value">{sheetName}</p>
      </div>
      <div>
        <p className="status-title">단어 수</p>
        <p className="status-value">{count}</p>
      </div>
    </section>
  );
};

export default StatusBar;
