"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GROUPS, R32_SLOTS } from "@/lib/tournament";
import type { TTeam, BTeam, KnockoutMatch, BracketState } from "@/lib/tournament";
import { Swords, Trophy, Medal, ChevronRight } from "lucide-react";

type Props = {
  bracket: BracketState;
  onChange: (b: BracketState) => void;
};

export function Tournament2026({ bracket, onChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { groupResults, bestThirds, r32, r16, qf, sf, final: finalMatch } = bracket;

  const allThirds = Object.values(groupResults)
    .map((r) => r.third)
    .filter((t): t is TTeam => t !== null);

  const groupsFilled = GROUPS.filter((g) => {
    const r = groupResults[g.letter];
    return r.first && r.second && r.third;
  }).length;

  const applyR32 = () => {
    const selected = bestThirds.filter((t): t is TTeam => t !== null);
    let resolvedThirds: BTeam[] = [...selected];
    if (selected.length < 8) {
      const remaining = allThirds.filter((t) => !selected.some((s) => s.id === t.id));
      resolvedThirds = [...selected, ...remaining.slice(0, 8 - selected.length)];
    }
    const fullThirds = [
      ...resolvedThirds,
      ...Array(Math.max(0, 8 - resolvedThirds.length)).fill(null),
    ].slice(0, 8);

    const resolve = (ref: string): BTeam => {
      if (ref.includes("3RD")) {
        const idx = parseInt(ref.replace("3RD", "")) - 1;
        return fullThirds[idx] ?? null;
      }
      const letter = ref.replace("1", "").replace("2", "");
      const place = ref.endsWith("1") ? "first" : "second";
      return groupResults[letter]?.[place] ?? null;
    };

    onChange({
      ...bracket,
      bestThirds: fullThirds as BTeam[],
      r32: R32_SLOTS.map((s) => ({
        home: resolve(s.homeRef),
        away: resolve(s.awayRef),
        winner: null,
      })),
      r16: Array.from({ length: 8 }, () => ({ home: null, away: null, winner: null })),
      qf: Array.from({ length: 4 }, () => ({ home: null, away: null, winner: null })),
      sf: Array.from({ length: 2 }, () => ({ home: null, away: null, winner: null })),
      final: { home: null, away: null, winner: null },
      thirdPlace: { home: null, away: null, winner: null },
    });
  };

  const toggleGroupTeam = (letter: string, team: TTeam) => {
    const cur = { ...groupResults[letter] };
    if (cur.first?.id === team.id) cur.first = null;
    else if (cur.second?.id === team.id) cur.second = null;
    else if (cur.third?.id === team.id) cur.third = null;
    else if (!cur.first) cur.first = team;
    else if (!cur.second) cur.second = team;
    else if (!cur.third) cur.third = team;
    onChange({ ...bracket, groupResults: { ...groupResults, [letter]: cur } });
  };

  const toggleThird = (team: TTeam) => {
    const idx = bestThirds.findIndex((t) => t?.id === team.id);
    const next = [...bestThirds];
    if (idx !== -1) next[idx] = null;
    else {
      const empty = next.findIndex((t) => t === null);
      if (empty !== -1) next[empty] = team;
    }
    onChange({ ...bracket, bestThirds: next });
  };

  const pickWinner = (
    key: "r32" | "r16" | "qf" | "sf" | "final",
    arr: KnockoutMatch[],
    idx: number,
    side: "home" | "away",
  ) => {
    const updated = arr.map((m, i) => {
      if (i !== idx) return m;
      const t = m[side];
      if (!t) return m;
      return m.winner?.id === t.id ? { ...m, winner: null } : { ...m, winner: t };
    });
    onChange({ ...bracket, [key]: updated } as BracketState);
  };

  const autoAdvance = (
    from: KnockoutMatch[],
    targetKey: "r16" | "qf" | "sf",
    pairCount: number,
  ) => {
    const winners = from.map((m) => m.winner).filter((w): w is TTeam => w !== null);
    const next: KnockoutMatch[] = [];
    for (let i = 0; i < pairCount; i++) {
      next.push({
        home: winners[i * 2] ?? null,
        away: winners[i * 2 + 1] ?? null,
        winner: null,
      });
    }
    onChange({ ...bracket, [targetKey]: next });
  };

  const teamName = (t: BTeam, fallback: string) => (t ? t.name : fallback);

  const MatchSlot = ({
    match,
    roundLabel,
    roundKey,
    matchIdx,
    arr,
    homePlaceholder,
    awayPlaceholder,
  }: {
    match: KnockoutMatch;
    roundLabel: string;
    roundKey: "r32" | "r16" | "qf" | "sf" | "final";
    matchIdx: number;
    arr: KnockoutMatch[];
    homePlaceholder?: string;
    awayPlaceholder?: string;
  }) => {
    const hasTeams = match.home && match.away;
    const homeLabel = teamName(match.home, homePlaceholder || "待定");
    const awayLabel = teamName(match.away, awayPlaceholder || "待定");
    return (
      <div
        className={`rounded-lg border px-2 py-1.5 text-[11px] min-w-[130px] max-w-[170px] ${
          match.winner
            ? "border-[#00FF00]/40 bg-[#00FF00]/6"
            : hasTeams
              ? "border-white/15 bg-slate-900/60"
              : "border-white/5 bg-slate-900/30"
        }`}
      >
        <div className="mb-1 flex items-center gap-1 text-[9px] text-slate-500">
          <Swords className="h-2.5 w-2.5" />
          <span>{roundLabel}</span>
        </div>
        <button
          type="button"
          disabled={!match.home}
          onClick={() => match.home && pickWinner(roundKey, arr, matchIdx, "home")}
          className={`block w-full truncate rounded py-0.5 px-1 text-left text-[11px] ${
            match.winner?.id === match.home?.id
              ? "bg-[#00FF00]/15 text-[#00FF00] font-bold"
              : match.home ? "text-slate-200 hover:bg-white/10" : "text-slate-500"
          }`}
        >
          {homeLabel}
        </button>
        <button
          type="button"
          disabled={!match.away}
          onClick={() => match.away && pickWinner(roundKey, arr, matchIdx, "away")}
          className={`block w-full truncate rounded py-0.5 px-1 text-left text-[11px] ${
            match.winner?.id === match.away?.id
              ? "bg-[#00FF00]/15 text-[#00FF00] font-bold"
              : match.away ? "text-slate-200 hover:bg-white/10" : "text-slate-500"
          }`}
        >
          {awayLabel}
        </button>
        {hasTeams && (
          <button
            onClick={() => {
              if (!match.home || !match.away) return;
              const params = new URLSearchParams(searchParams.toString());
              params.set("tab", "sandbox");
              params.set("my", match.home.id);
              params.set("opp", match.away.id);
              router.push(`/?${params.toString()}`);
            }}
            className="mt-1 w-full rounded border border-sky-500/20 bg-sky-500/5 py-0.5 text-[9px] text-sky-200 hover:bg-sky-500/10"
          >
            沙盘
          </button>
        )}
      </div>
    );
  };

  const r16HasData = r16.some((m) => m.home || m.away);
  const qfHasData = qf.some((m) => m.home || m.away);
  const sfHasData = sf.some((m) => m.home || m.away);

  const R16_PLACEHOLDERS = [
    { h: "32强 M1胜者", a: "32强 M2胜者" },
    { h: "32强 M3胜者", a: "32强 M4胜者" },
    { h: "32强 M5胜者", a: "32强 M6胜者" },
    { h: "32强 M7胜者", a: "32强 M8胜者" },
    { h: "32强 M9胜者", a: "32强 M10胜者" },
    { h: "32强 M11胜者", a: "32强 M12胜者" },
    { h: "32强 M13胜者", a: "32强 M14胜者" },
    { h: "32强 M15胜者", a: "32强 M16胜者" },
  ];

  const QF_PLACEHOLDERS = [
    { h: "16强 M1胜者", a: "16强 M2胜者" },
    { h: "16强 M3胜者", a: "16强 M4胜者" },
    { h: "16强 M5胜者", a: "16强 M6胜者" },
    { h: "16强 M7胜者", a: "16强 M8胜者" },
  ];

  const SF_PLACEHOLDERS = [
    { h: "QF1 胜者", a: "QF2 胜者" },
    { h: "QF3 胜者", a: "QF4 胜者" },
  ];

  return (
    <div className="space-y-6">
      {/* ============ 小组赛 ============ */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#00FF00]" />
              小组赛
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              点击球队依次选出小组第一🥇、第二🥈、第三🥉，然后勾选8支最佳第三。不必选满即可生成淘汰赛树。
            </p>
          </div>
          <button
            type="button"
            onClick={applyR32}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#00FF00]/40 bg-[#00FF00]/10 px-3 py-1.5 text-xs font-medium text-[#00FF00] hover:bg-[#00FF00]/20 transition"
          >
            生成淘汰赛树 ({groupsFilled}/12 组)
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {GROUPS.map((g) => {
            const r = groupResults[g.letter];
            return (
              <div key={g.letter} className="rounded-lg border border-white/8 bg-slate-900/40 p-2.5">
                <div className="mb-1.5 text-[11px] font-semibold text-[#00FF00]">
                  Group {g.letter}
                </div>
                <div className="space-y-0.5">
                  {g.teams.map((t) => {
                    let badge = "";
                    if (r?.first?.id === t.id) badge = "🥇";
                    else if (r?.second?.id === t.id) badge = "🥈";
                    else if (r?.third?.id === t.id) badge = "🥉";
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleGroupTeam(g.letter, t)}
                        className={`w-full flex items-center gap-1 rounded py-0.5 px-1 text-left text-[10px] truncate ${
                          badge
                            ? "bg-[#00FF00]/10 text-white border border-[#00FF00]/20"
                            : "text-slate-500 hover:text-slate-200"
                        }`}
                      >
                        <span className="w-4 shrink-0 text-center">{badge || "·"}</span>
                        <span className="truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {allThirds.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/3 p-3">
            <div className="mb-1.5 text-[11px] font-semibold text-amber-200 flex items-center gap-1.5">
              <Medal className="h-3.5 w-3.5" />
              最佳小组第三 ({bestThirds.filter(Boolean).length}/8)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allThirds.map((t) => {
                const sel = bestThirds.some((bt) => bt?.id === t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleThird(t)}
                    className={`rounded px-2 py-0.5 text-[10px] ${
                      sel
                        ? "bg-[#00FF00]/12 text-[#00FF00] border border-[#00FF00]/30"
                        : "bg-slate-900/40 text-slate-500 border border-white/5 hover:border-white/15"
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============ 淘汰赛树 (始终可见) ============ */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold text-white">淘汰赛树状图</h2>
        <p className="mb-4 text-[11px] text-slate-500">
          点击球队名选择胜者 → 点击晋级按钮推进（无需选满） → 每场比赛可送沙盘分析
        </p>

        <div className="flex gap-3" style={{ minWidth: 900 }}>
          {/* ===== 32强 ===== */}
          <div className="flex flex-col gap-2 shrink-0" style={{ width: 150 }}>
            <div className="text-[10px] font-semibold text-slate-400 text-center mb-1">32强</div>
            {r32.map((m, i) => (
              <div key={i} className="relative">
                <MatchSlot
                  match={m}
                  roundLabel={`M${i + 1}`}
                  roundKey="r32"
                  matchIdx={i}
                  arr={r32}
                  homePlaceholder={R32_SLOTS[i].homeLabel}
                  awayPlaceholder={R32_SLOTS[i].awayLabel}
                />
                {i % 2 === 0 && i + 1 < r32.length && (
                  <div className="absolute -right-1.5 top-1/2 h-px w-3 bg-white/10" />
                )}
              </div>
            ))}
          </div>

          {/* ===== 16强 ===== */}
          <div className="flex flex-col justify-center gap-3 shrink-0" style={{ width: 150 }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-slate-400">16强</div>
              <button
                onClick={() => autoAdvance(r32, "r16", 8)}
                className="rounded border border-sky-500/20 px-1.5 py-0.5 text-[9px] text-sky-300 hover:bg-sky-500/10"
              >
                晋级 <ChevronRight className="inline h-2.5 w-2.5" />
              </button>
            </div>
            {r16HasData
              ? r16.map((m, i) => (
                  <div key={i} className="relative">
                    <MatchSlot
                      match={m}
                      roundLabel={`M${i + 1}`}
                      roundKey="r16"
                      matchIdx={i}
                      arr={r16}
                      homePlaceholder={R16_PLACEHOLDERS[i].h}
                      awayPlaceholder={R16_PLACEHOLDERS[i].a}
                    />
                    {i % 2 === 0 && i + 1 < r16.length && (
                      <div className="absolute -right-1.5 top-1/2 h-px w-3 bg-white/10" />
                    )}
                  </div>
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-slate-900/20 py-2 px-2 text-[10px] text-slate-600 text-center">
                    {R16_PLACEHOLDERS[i].h} vs {R16_PLACEHOLDERS[i].a}
                  </div>
                ))}
          </div>

          {/* ===== 8强 ===== */}
          <div className="flex flex-col justify-center gap-3 shrink-0" style={{ width: 150 }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-slate-400">¼决赛</div>
              <button
                onClick={() => autoAdvance(r16, "qf", 4)}
                className="rounded border border-sky-500/20 px-1.5 py-0.5 text-[9px] text-sky-300 hover:bg-sky-500/10"
              >
                晋级 <ChevronRight className="inline h-2.5 w-2.5" />
              </button>
            </div>
            {qfHasData
              ? qf.map((m, i) => (
                  <div key={i} className="relative">
                    <MatchSlot
                      match={m}
                      roundLabel={`QF${i + 1}`}
                      roundKey="qf"
                      matchIdx={i}
                      arr={qf}
                      homePlaceholder={QF_PLACEHOLDERS[i].h}
                      awayPlaceholder={QF_PLACEHOLDERS[i].a}
                    />
                    {i % 2 === 0 && i + 1 < qf.length && (
                      <div className="absolute -right-1.5 top-1/2 h-px w-3 bg-white/10" />
                    )}
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-slate-900/20 py-2 px-2 text-[10px] text-slate-600 text-center">
                    {QF_PLACEHOLDERS[i].h} vs {QF_PLACEHOLDERS[i].a}
                  </div>
                ))}
          </div>

          {/* ===== 半决赛 ===== */}
          <div className="flex flex-col justify-center gap-3 shrink-0" style={{ width: 150 }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-slate-400">半决赛</div>
              <button
                onClick={() => autoAdvance(qf, "sf", 2)}
                className="rounded border border-sky-500/20 px-1.5 py-0.5 text-[9px] text-sky-300 hover:bg-sky-500/10"
              >
                晋级 <ChevronRight className="inline h-2.5 w-2.5" />
              </button>
            </div>
            {sfHasData
              ? sf.map((m, i) => (
                  <MatchSlot
                    key={i}
                    match={m}
                    roundLabel={`半决赛${i + 1}`}
                    roundKey="sf"
                    matchIdx={i}
                    arr={sf}
                    homePlaceholder={SF_PLACEHOLDERS[i].h}
                    awayPlaceholder={SF_PLACEHOLDERS[i].a}
                  />
                ))
              : Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-slate-900/20 py-2 px-2 text-[10px] text-slate-600 text-center">
                    {SF_PLACEHOLDERS[i].h} vs {SF_PLACEHOLDERS[i].a}
                  </div>
                ))}
          </div>

          {/* ===== 决赛 ===== */}
          <div className="flex flex-col justify-center gap-3 shrink-0" style={{ width: 150 }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-slate-400">决赛</div>
              <button
                onClick={() => {
                  const w0 = sf[0]?.winner;
                  const w1 = sf[1]?.winner;
                  onChange({
                    ...bracket,
                    final: { home: w0 ?? null, away: w1 ?? null, winner: null },
                  });
                }}
                className="rounded border border-sky-500/20 px-1.5 py-0.5 text-[9px] text-sky-300 hover:bg-sky-500/10"
              >
                晋级决赛 <ChevronRight className="inline h-2.5 w-2.5" />
              </button>
            </div>
            {finalMatch.home || finalMatch.away ? (
              <MatchSlot
                match={finalMatch}
                roundLabel="冠军战"
                roundKey="final"
                matchIdx={0}
                arr={[finalMatch]}
                homePlaceholder="半决赛1 胜者"
                awayPlaceholder="半决赛2 胜者"
              />
            ) : (
              <div className="rounded-lg border border-white/5 bg-slate-900/20 py-2 text-[10px] text-slate-600 text-center">
                半决赛胜者对决
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ 冠军展示 ============ */}
      {finalMatch.winner && (
        <div className="rounded-2xl border border-[#00FF00]/30 bg-[#00FF00]/5 p-6 text-center backdrop-blur-md">
          <Trophy className="mx-auto h-8 w-8 text-[#00FF00]" />
          <h2 className="mt-2 text-xl font-bold text-[#00FF00]">{finalMatch.winner.name}</h2>
          <p className="text-sm text-slate-300">🏆 2026 世界杯冠军</p>
        </div>
      )}
    </div>
  );
}
