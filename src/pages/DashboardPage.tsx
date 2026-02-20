import type React from "react";
import { Aside } from "../components/dashboard/Aside";
import { useState } from "react";
import { Content } from "../components/dashboard/Content";

export const DashboardPage: React.FC = () => {
  const [asideOpen, setAsideOpen] = useState(true);

  const handleAside = () => {
    setAsideOpen((prev) => !prev);
  };

  return (
    <div
      className={`${asideOpen ? "grid grid-cols-[280px_1fr]" : "relative flex"} h-full`}
    >
      <Aside asideOpen={asideOpen} handleAside={handleAside} />
      <div
        className={`${!asideOpen && "flex-1"}`}
        style={{
          background: `
      radial-gradient(100% 120% at 50% -20%, rgba(86,157,255,0.15) 0%, rgba(0,85,233,0.08) 30%, rgba(0,85,233,0) 60%),
      radial-gradient(80% 80% at 80% 80%, rgba(106,20,217,0.12) 0%, rgba(0,203,200,0.08) 40%, rgba(0,203,200,0) 70%),
      linear-gradient(180deg, #FFF 0%, rgba(240,245,255,0.6) 25%, rgba(227,238,255,0.7) 50%, rgba(217,230,255,0.5) 75%, #FFF 100%)
    `,
        }}
      >
        <Content />
      </div>
    </div>
  );
};
