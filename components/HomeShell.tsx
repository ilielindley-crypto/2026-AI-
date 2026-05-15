"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Navbar, type AppTab } from "./Navbar";
import { TacticalSandbox } from "./TacticalSandbox";
import { Tournament2026 } from "./Tournament2026";
import { emptyBracketState } from "@/lib/tournament";
import type { BracketState } from "@/lib/tournament";

export function HomeShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabFromUrl = useMemo<AppTab>(() => {
    const t = searchParams.get("tab");
    return t === "bracket" ? "bracket" : "sandbox";
  }, [searchParams]);

  const [tab, setTab] = useState<AppTab>(tabFromUrl);
  const [bracket, setBracket] = useState<BracketState>(emptyBracketState);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  const myPreset = searchParams.get("my");
  const oppPreset = searchParams.get("opp");
  const pairPreset =
    myPreset && oppPreset
      ? { my: myPreset.toUpperCase(), opp: oppPreset.toUpperCase() }
      : null;

  const handleTabChange = useCallback(
    (t: AppTab) => {
      setTab(t);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", t === "bracket" ? "bracket" : "sandbox");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const clearPairParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("my");
    params.delete("opp");
    if (!params.get("tab")) params.set("tab", "sandbox");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar tab={tab} onTabChange={handleTabChange} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className={tab === "sandbox" ? "block" : "hidden"}>
          <TacticalSandbox
            presetPair={pairPreset}
            onPresetConsumed={clearPairParams}
          />
        </div>
        <div className={tab === "bracket" ? "block" : "hidden"}>
          <Tournament2026 bracket={bracket} onChange={setBracket} />
        </div>
      </main>
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        DeepSeek API Key 请配置于环境变量{" "}
        <code className="text-slate-400">DEEPSEEK_API_KEY</code>
      </footer>
    </div>
  );
}
