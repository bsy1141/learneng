import type { TabConfig, TabKey } from "../../types/tabs";

type TabBarProps = {
  tabs: TabConfig[];
  activeKey: TabKey;
  onChange: (key: TabKey) => void;
};

const TabBar = ({ tabs, activeKey, onChange }: TabBarProps) => {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab ${tab.key === activeKey ? "active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
