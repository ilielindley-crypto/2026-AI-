"use client";

import { Brain, GitBranch, LayoutGrid } from "lucide-react";

export type AppTab = "sandbox" | "bracket";

type Props = {
  tab: AppTab;
  onTabChange: (t: AppTab) => void;
};

export function Navbar({ tab, onTabChange }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00FF00]/40 bg-slate-900/80 shadow-neon">
            <Brain className="h-6 w-6 text-[#00FF00]" aria-hidden />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              AI 赛事参谋
            </div>
            <div className="text-xs text-slate-400">AI Match Brain · 数据推演 · 无图像识别</div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange("sandbox")}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              tab === "sandbox"
                ? "border-[#00FF00]/50 bg-[#00FF00]/10 text-[#00FF00]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-500/40 hover:text-white"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            双边战术沙盘
          </button>
          <button
            type="button"
            onClick={() => onTabChange("bracket")}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              tab === "bracket"
                ? "border-sky-400/50 bg-sky-500/10 text-sky-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-500/40 hover:text-white"
            }`}
          >
            <GitBranch className="h-4 w-4" />
            2026 晋级树
          </button>
        </nav>
      </div>
    </header>
  );
}
