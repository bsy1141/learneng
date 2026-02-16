import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  variant?: "default" | "error";
};

const Panel = ({ children, variant = "default" }: PanelProps) => {
  return (
    <div className={`panel${variant === "error" ? " error" : ""}`}>
      {children}
    </div>
  );
};

export default Panel;
