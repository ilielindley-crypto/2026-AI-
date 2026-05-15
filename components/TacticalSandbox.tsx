"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import html2canvas from "html2canvas";
import {
  Activity,
  Camera,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAllTeamOptions,
  getTeamName,
  getTeamPlayers,
} from "@/data/teams2026.js";
import { DEFAULT_FORMATION_SLOTS } from "@/lib/formation";
import type { MatchupAnalysis } from "@/lib/types";
import type { PitchSide } from "@/lib/types";
import type { WcPlayer, WcPosition } from "@/lib/wcTypes";
import { WcPlayerCard } from "@/components/WcPlayerCard";

type Props = {
  presetPair?: { my: string; opp: string } | null;
  onPresetConsumed?: () => void;
};

type BenchDrag = { scope: "bench"; side: PitchSide; player: WcPlayer };
type SlotDrag = {
  scope: "slot";
  side: PitchSide;
  index: number;
  player: WcPlayer;
};
type DragPayload = BenchDrag | SlotDrag;

type SlotDropData = {
  scope: "slot";
  side: PitchSide;
  index: number;
  role: WcPosition;
};

type BenchDropData = { scope: "bench-drop"; side: PitchSide };

const emptyLineup = () => Array<WcPlayer | null>(11).fill(null);

function mergeRefs<T extends HTMLElement>(
  ...refs: Array<React.Ref<T> | undefined>
) {
  return (node: T | null) => {
    refs.forEach((r) => {
      if (!r) return;
      if (typeof r === "function") r(node);
      else (r as React.MutableRefObject<T | null>).current = node;
    });
  };
}

function PitchSlot({
  side,
  index,
  player,
  activeDrag,
  onClear,
}: {
  side: PitchSide;
  index: number;
  player: WcPlayer | null;
  activeDrag: DragPayload | null;
  onClear: () => void;
}) {
  const slot = DEFAULT_FORMATION_SLOTS[index];
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `slot-${side}-${index}`,
    data: {
      scope: "slot",
      side,
      index,
      role: slot.role,
    } satisfies SlotDropData,
  });

  const drag = useDraggable({
    id: `slot-drag-${side}-${index}`,
    disabled: !player,
    data: player
      ? ({
          scope: "slot",
          side,
          index,
          player,
        } satisfies SlotDrag)
      : undefined,
  });

  const setRef = player ? mergeRefs(setDropRef, drag.setNodeRef) : setDropRef;

  const pulse =
    isOver &&
    activeDrag &&
    activeDrag.side === side &&
    activeDrag.player.position === slot.role &&
    (activeDrag.scope === "bench" ||
      (activeDrag.scope === "slot" &&
        (!player ||
          player.position === DEFAULT_FORMATION_SLOTS[activeDrag.index].role)));

  const style = drag.transform
    ? { transform: CSS.Translate.toString(drag.transform), zIndex: 40 }
    : undefined;

  return (
    <div
      ref={setRef}
      style={style}
      {...(player ? drag.listeners : {})}
      {...(player ? drag.attributes : {})}
      className={`relative flex w-[104px] flex-col items-stretch rounded-xl border text-[10px] transition ${
        pulse
          ? "slot-breathe border-[#00FF00]/70 bg-[#00FF00]/10 shadow-[0_0_18px_rgba(0,255,0,0.35)]"
          : "border-white/10 bg-black/35 hover:border-sky-500/35"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-1.5 py-1 text-[9px] uppercase text-slate-500">
        <span>{slot.label}</span>
        {player && (
          <button
            type="button"
            className="rounded bg-black/50 px-1 text-[9px] text-slate-300 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center p-1">
        {player ? (
          <WcPlayerCard player={player} variant="slot" />
        ) : (
          <span className="px-1 text-center text-[10px] text-slate-500">
            拖入球员
          </span>
        )}
      </div>
    </div>
  );
}

function BenchDropZone({ side }: { side: PitchSide }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `bench-drop-${side}`,
    data: { scope: "bench-drop", side } satisfies BenchDropData,
  });
  return (
    <div
      ref={setNodeRef}
      className={`mt-2 rounded-lg border border-dashed px-2 py-2 text-center text-[10px] transition ${
        isOver
          ? "border-sky-400/60 bg-sky-500/10 text-sky-100"
          : "border-white/10 text-slate-500"
      }`}
    >
      将场上卡片拖回此处以撤下首发
    </div>
  );
}

export function TacticalSandbox({ presetPair, onPresetConsumed }: Props) {
  const appliedPair = useRef<string | null>(null);
  const [homeTeamId, setHomeTeamId] = useState("BRA");
  const [awayTeamId, setAwayTeamId] = useState("ARG");
  const [homeLineup, setHomeLineup] = useState<(WcPlayer | null)[]>(emptyLineup);
  const [awayLineup, setAwayLineup] = useState<(WcPlayer | null)[]>(emptyLineup);

  const [analysis, setAnalysis] = useState<MatchupAnalysis | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<{ mock?: boolean } | null>(
    null,
  );
  const [loadingMatchup, setLoadingMatchup] = useState(false);

  const [scenarioInput, setScenarioInput] = useState("");
  const [scenarioLog, setScenarioLog] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [scenarioBusy, setScenarioBusy] = useState(false);
  const [typewriterTarget, setTypewriterTarget] = useState<string | null>(null);
  const [typewriterShown, setTypewriterShown] = useState("");

  const [activeDrag, setActiveDrag] = useState<DragPayload | null>(null);
  const [invalidMsg, setInvalidMsg] = useState<string | null>(null);

  const posterRef = useRef<HTMLDivElement | null>(null);

  const teamOptions = useMemo(() => getAllTeamOptions(), []);

  const homeRoster = useMemo(
    () => getTeamPlayers(homeTeamId),
    [homeTeamId],
  );
  const awayRoster = useMemo(
    () => getTeamPlayers(awayTeamId),
    [awayTeamId],
  );

  const homeName = useMemo(() => getTeamName(homeTeamId), [homeTeamId]);
  const awayName = useMemo(() => getTeamName(awayTeamId), [awayTeamId]);

  useEffect(() => {
    if (!presetPair) {
      appliedPair.current = null;
      return;
    }
    const key = `${presetPair.my}-${presetPair.opp}`;
    if (appliedPair.current === key) return;
    appliedPair.current = key;
    setHomeTeamId(presetPair.my);
    setAwayTeamId(presetPair.opp);
    setHomeLineup(emptyLineup());
    setAwayLineup(emptyLineup());
    setAnalysis(null);
    setAnalysisMeta(null);
    setScenarioLog([]);
    setTypewriterTarget(null);
    setTypewriterShown("");
    onPresetConsumed?.();
  }, [presetPair, onPresetConsumed]);

  const usedIds = useMemo(() => {
    const s = new Set<string>();
    homeLineup.forEach((p) => p && s.add(p.id));
    awayLineup.forEach((p) => p && s.add(p.id));
    return s;
  }, [homeLineup, awayLineup]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const resetSide = (side: PitchSide) => {
    if (side === "home") setHomeLineup(emptyLineup());
    else setAwayLineup(emptyLineup());
    setAnalysis(null);
    setAnalysisMeta(null);
  };

  const handleTeamChange = (side: PitchSide, id: string) => {
    if (side === "home") {
      setHomeTeamId(id);
      setHomeLineup(emptyLineup());
    } else {
      setAwayTeamId(id);
      setAwayLineup(emptyLineup());
    }
    setAnalysis(null);
    setAnalysisMeta(null);
  };

  const clearSlot = (side: PitchSide, index: number) => {
    const set = side === "home" ? setHomeLineup : setAwayLineup;
    set((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
  };

  const handleBenchClick = (side: PitchSide, player: WcPlayer) => {
    const lineup = side === "home" ? homeLineup : awayLineup;
    const position = player.position;

    const slotIndex = DEFAULT_FORMATION_SLOTS.findIndex(
      (slot, i) => slot.role === position && lineup[i] === null,
    );

    if (slotIndex === -1) {
      const occupiedCount = lineup.filter(
        (p) => p !== null && p.position === position,
      ).length;
      const totalSlots = DEFAULT_FORMATION_SLOTS.filter(
        (s) => s.role === position,
      ).length;
      if (occupiedCount >= totalSlots) {
        setInvalidMsg(
          `${position} 位置已满（${totalSlots}个槽位均已占用），无法再添加 ${player.name}。`,
        );
      } else {
        setInvalidMsg(
          `${player.name} 已是先发阵容中的一员。`,
        );
      }
      return;
    }

    assignToSlot(side, slotIndex, player);
  };

  const autoFillOptimal = (side: PitchSide) => {
    const roster = side === "home" ? homeRoster : awayRoster;
    const set = side === "home" ? setHomeLineup : setAwayLineup;
    const used = new Set<string>();

    const picks: (WcPlayer | null)[] = DEFAULT_FORMATION_SLOTS.map((slot) => {
      const candidates = roster
        .filter((p) => p.position === slot.role && !used.has(p.id))
        .sort((a, b) => b.ovr - a.ovr);
      if (candidates.length === 0) return null;
      const best = candidates[0];
      used.add(best.id);
      return best;
    });

    set(picks);
  };

  const removePlayerEverywhere = (playerId: string) => {
    setHomeLineup((prev) => prev.map((p) => (p?.id === playerId ? null : p)));
    setAwayLineup((prev) => prev.map((p) => (p?.id === playerId ? null : p)));
  };

  const assignToSlot = (side: PitchSide, index: number, player: WcPlayer) => {
    const role = DEFAULT_FORMATION_SLOTS[index].role;
    if (player.position !== role) {
      setInvalidMsg(
        `位置不匹配：${player.name} 为 ${player.position}，不能放入「${DEFAULT_FORMATION_SLOTS[index].label}」槽位（需要 ${role}）。`,
      );
      return false;
    }
    removePlayerEverywhere(player.id);
    const set = side === "home" ? setHomeLineup : setAwayLineup;
    set((prev) => {
      const n = [...prev];
      n[index] = player;
      return n;
    });
    return true;
  };

  const handleDragStart = (e: DragStartEvent) => {
    const d = e.active.data.current as DragPayload | undefined;
    if (d && (d.scope === "bench" || d.scope === "slot")) setActiveDrag(d);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null);
    const { active, over } = e;
    if (!over) return;
    const src = active.data.current as DragPayload | undefined;
    const dst = over.data.current as SlotDropData | BenchDropData | undefined;
    if (!src) return;

    if (dst?.scope === "bench-drop") {
      if (src.scope === "slot") {
        clearSlot(src.side, src.index);
      }
      return;
    }

    if (dst?.scope === "slot") {
      if (src.scope === "bench") {
        if (src.side !== dst.side) {
          setInvalidMsg("不能把一侧名单中的球员直接拖入另一侧球场。");
          return;
        }
        assignToSlot(dst.side, dst.index, src.player);
        return;
      }
      if (src.scope === "slot") {
        if (src.side !== dst.side) {
          setInvalidMsg("不能跨半场直接移动场上球员。");
          return;
        }
        const a = src.index;
        const b = dst.index;
        if (a === b) return;
        const set = src.side === "home" ? setHomeLineup : setAwayLineup;
        set((prev) => {
          const n = [...prev];
          const pa = n[a];
          const pb = n[b];
          const roleB = DEFAULT_FORMATION_SLOTS[b].role;
          const roleA = DEFAULT_FORMATION_SLOTS[a].role;
          if (!pa) return prev;
          if (!pb) {
            if (pa.position !== roleB) {
              setTimeout(
                () =>
                  setInvalidMsg(
                    "目标槽位与球员位置不匹配：该球员无法站到这个位置。",
                  ),
                0,
              );
              return prev;
            }
            n[b] = pa;
            n[a] = null;
            return n;
          }
          if (pa.position !== roleB || pb.position !== roleA) {
            setTimeout(
              () =>
                setInvalidMsg(
                  "交换后位置不兼容：请通过撤下再重新上阵调整阵容。",
                ),
              0,
            );
            return prev;
          }
          n[a] = pb;
          n[b] = pa;
          return n;
        });
      }
    }
  };

  const lineupComplete = (arr: (WcPlayer | null)[]) =>
    arr.every((p) => p !== null);
  const ready =
    lineupComplete(homeLineup) && lineupComplete(awayLineup);

  const runMatchup = async () => {
    if (!ready) return;
    setLoadingMatchup(true);
    try {
      const res = await fetch("/api/matchup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAName: homeName,
          teamBName: awayName,
          lineupA: homeLineup.map((p) => ({
            name: p!.name,
            pos: p!.position,
            ovr: p!.ovr,
            stats: p!.stats,
            tags: p!.tags,
          })),
          lineupB: awayLineup.map((p) => ({
            name: p!.name,
            pos: p!.position,
            ovr: p!.ovr,
            stats: p!.stats,
            tags: p!.tags,
          })),
        }),
      });
      const json = await res.json();
      const data = json.data ?? json.fallback;
      if (data) {
        setAnalysis(data as MatchupAnalysis);
        setAnalysisMeta({ mock: !!json.mock });
      }
    } finally {
      setLoadingMatchup(false);
    }
  };

  const buildScenarioContext = () => {
    const fmt = (label: string, team: string, lu: (WcPlayer | null)[]) =>
      `${label}【${team}】\n` +
      lu
        .map((p, i) =>
          p
            ? `${DEFAULT_FORMATION_SLOTS[i].label}(${p.position}): ${p.name} OVR${p.ovr}`
            : `${DEFAULT_FORMATION_SLOTS[i].label}: （空缺）`,
        )
        .join("\n");
    let ctx =
      fmt("我方", homeName, homeLineup) +
      "\n\n" +
      fmt("对手", awayName, awayLineup);
    if (analysis) {
      ctx += `\n\n【胜率模型】我方 ${analysis.winRateA}% vs 对手 ${analysis.winRateB}%\n总结：${analysis.summary}`;
    }
    return ctx;
  };

  const sendScenario = async () => {
    const q = scenarioInput.trim();
    if (!q || scenarioBusy) return;
    setScenarioBusy(true);
    setScenarioInput("");
    setScenarioLog((l) => [...l, { role: "user", text: q }]);
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          context: buildScenarioContext(),
        }),
      });
      const json = await res.json();
      const reply = (json.reply as string) || "（无应答）";
      setTypewriterTarget(reply);
    } catch {
      setTypewriterTarget(
        "后场先横向转移，避开对手压迫强侧；同时让边前卫回撤接球，形成 3-2 出球结构。",
      );
    } finally {
      setScenarioBusy(false);
    }
  };

  useEffect(() => {
    if (!typewriterTarget) {
      setTypewriterShown("");
      return;
    }
    let i = 0;
    setTypewriterShown("");
    const tick = () => {
      i += 1;
      setTypewriterShown(typewriterTarget.slice(0, i));
      if (i >= typewriterTarget.length) {
        clearInterval(id);
        setScenarioLog((l) => [
          ...l,
          { role: "assistant", text: typewriterTarget },
        ]);
        setTypewriterTarget(null);
      }
    };
    const id = setInterval(tick, 14);
    return () => clearInterval(id);
  }, [typewriterTarget]);

  const generatePoster = useCallback(async () => {
    if (!posterRef.current) return;
    const scale = 2;
    const canvas = await html2canvas(posterRef.current, {
      scale,
      backgroundColor: "#020617",
      useCORS: true,
    });
    const footerH = Math.round(130 * scale);
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height + footerH;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0);
    const pad = 28 * scale;
    ctx.fillStyle = "#00ff00";
    ctx.font = `700 ${22 * scale}px system-ui`;
    ctx.fillText("AI Match Brain", pad, canvas.height + 42 * scale);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${14 * scale}px system-ui`;
    ctx.fillText("AI赛事参谋生成", pad, canvas.height + 72 * scale);
    ctx.strokeStyle = "rgba(0,255,0,0.35)";
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(
      pad - 8 * scale,
      canvas.height + 18 * scale,
      46 * scale,
      46 * scale,
    );
    ctx.fillStyle = "#00ff00";
    ctx.font = `700 ${18 * scale}px system-ui`;
    ctx.fillText("AI", pad + 6 * scale, canvas.height + 50 * scale);
    const url = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-match-brain-${Date.now()}.png`;
    a.click();
  }, []);

  const renderPitchHalf = (side: PitchSide) => {
    const lineup = side === "home" ? homeLineup : awayLineup;
    const isAway = side === "away";
    const blocks: { label: string; indices: number[] }[] = isAway
      ? [
          { label: "前锋", indices: [8, 9, 10] },
          { label: "中场", indices: [5, 6, 7] },
          { label: "后卫", indices: [1, 2, 3, 4] },
          { label: "门将", indices: [0] },
        ]
      : [
          { label: "门将", indices: [0] },
          { label: "后卫", indices: [1, 2, 3, 4] },
          { label: "中场", indices: [5, 6, 7] },
          { label: "前锋", indices: [8, 9, 10] },
        ];

    return (
      <div
        className={`flex flex-1 flex-col items-center gap-2 py-2 ${
          isAway ? "pb-1 pt-3" : "pt-1 pb-3"
        }`}
      >
        {blocks.map((block) => (
          <div key={block.label} className="flex flex-wrap justify-center gap-2">
            {block.indices.map((idx) => (
              <PitchSlot
                key={idx}
                side={side}
                index={idx}
                player={lineup[idx]}
                activeDrag={activeDrag}
                onClear={() => clearSlot(side, idx)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  function BenchRoster({ side }: { side: PitchSide }) {
    const roster = side === "home" ? homeRoster : awayRoster;
    const bench = roster.filter((p) => !usedIds.has(p.id));
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            大名单 · {bench.length} 人
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="rounded border border-[#00FF00]/30 bg-[#00FF00]/8 px-2 py-0.5 text-[10px] text-[#00FF00] hover:bg-[#00FF00]/18 transition"
              onClick={() => autoFillOptimal(side)}
              title="按球员OVR数值自动填充最优11人阵容"
            >
              ⚡ 最优阵容
            </button>
            <button
              type="button"
              className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-white/5"
              onClick={() => resetSide(side)}
            >
              清空
            </button>
          </div>
        </div>
        {bench.length === 0 && (
          <p className="py-4 text-center text-[10px] text-slate-600">
            所有球员已在首发阵容中
          </p>
        )}
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {bench.map((p) => (
            <DraggableBenchCard
              key={p.id}
              side={side}
              player={p}
              onClickToAdd={() => handleBenchClick(side, p)}
            />
          ))}
        </div>
        <BenchDropZone side={side} />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">双边战术沙盘</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              FIFA 风格球员卡 + dnd-kit 拖拽排阵；位置不符将回弹并提示。完成后可生成深度对位解析、突发场景推演与海报导出。
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-3 text-sm font-semibold text-[#00FF00]">我的球队</div>
            <label className="block text-xs text-slate-400">选择国家队</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none focus:border-[#00FF00]/50"
              value={homeTeamId}
              onChange={(e) => handleTeamChange("home", e.target.value)}
            >
              {teamOptions.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <div className="mt-4">
              <BenchRoster side="home" />
            </div>
          </section>

          <section className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-3 backdrop-blur-md">
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                onClick={generatePoster}
                className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 shadow-lg hover:bg-sky-500/20"
              >
                <Camera className="h-3.5 w-3.5" />
                生成海报
              </button>
            </div>

            <div
              ref={posterRef}
              className="mt-10 space-y-3 rounded-xl border border-white/5 bg-black/20 p-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{homeName} · 主场</span>
                <span className="text-[10px] text-slate-600">中线</span>
                <span>{awayName} · 客场</span>
              </div>

              <div
                className="relative overflow-hidden rounded-xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(22,101,52,0.55), rgba(15,118,110,0.45))",
                }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
                  <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25" />
                </div>

                <div className="relative z-[1] flex min-h-[460px] flex-col">
                  {renderPitchHalf("home")}
                  <div className="mx-auto my-1 w-[88%] border-t border-dashed border-white/25" />
                  {renderPitchHalf("away")}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs">
                  <div className="mb-1 text-[10px] text-slate-500">首发 · {homeName}</div>
                  <ol className="list-decimal space-y-0.5 pl-4 text-slate-200">
                    {homeLineup.map((p, i) => (
                      <li key={i}>
                        {p ? `${p.name} (${p.position})` : "—"}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs">
                  <div className="mb-1 text-[10px] text-slate-500">首发 · {awayName}</div>
                  <ol className="list-decimal space-y-0.5 pl-4 text-slate-200">
                    {awayLineup.map((p, i) => (
                      <li key={i}>
                        {p ? `${p.name} (${p.position})` : "—"}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Activity className="h-4 w-4 text-[#00FF00]" />
                  AI 对位解析摘要
                </div>
                {analysis ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-[#00FF00]"
                        style={{ width: `${analysis.winRateA}%` }}
                      />
                      <div
                        className="h-full bg-sky-500"
                        style={{ width: `${analysis.winRateB}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span className="text-[#00FF00]">
                        {homeTeamId} {analysis.winRateA}%
                      </span>
                      <span className="text-sky-300">
                        {awayTeamId} {analysis.winRateB}%
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {analysis.summary}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    完成排阵并点击「生成深度对位解析」后展示胜率条与总结。
                  </p>
                )}
              </div>

              {analysis && (
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      结构化战术面板
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setAnalysis(null);
                        setAnalysisMeta(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      清空解析
                    </button>
                  </div>

                  <div className="mb-6 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-2 text-xs font-medium text-slate-400">胜率条</div>
                    <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-[#00FF00]"
                        style={{ width: `${analysis.winRateA}%` }}
                      />
                      <div
                        className="h-full bg-sky-500"
                        style={{ width: `${analysis.winRateB}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="font-semibold text-[#00FF00]">
                        {homeName} {analysis.winRateA}%
                      </span>
                      <span className="font-semibold text-sky-300">
                        {awayName} {analysis.winRateB}%
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 text-xs font-medium text-slate-400">关键对位</div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {analysis.keyMatchups.map((k, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-4"
                      >
                        <div className="text-[11px] font-semibold text-[#00FF00]">
                          {k.playerA}
                        </div>
                        <div className="my-1 text-[10px] text-slate-500">VS</div>
                        <div className="text-[11px] font-semibold text-sky-300">
                          {k.playerB}
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                          {k.analysis}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-[#00FF00]/25 bg-[#00FF00]/5 p-4">
                    <div className="text-xs font-semibold text-[#00FF00]">一句话总结</div>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-white">
                      {analysis.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!ready || loadingMatchup}
                onClick={runMatchup}
                className="inline-flex items-center gap-2 rounded-lg border border-[#00FF00]/40 bg-[#00FF00]/10 px-4 py-2 text-sm font-semibold text-[#00FF00] transition enabled:hover:bg-[#00FF00]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loadingMatchup ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                生成深度对位解析
              </button>
              {analysisMeta?.mock && (
                <span className="text-[11px] text-amber-300/90">
                  当前为 Mock / 兜底数据展示
                </span>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-3 text-sm font-semibold text-sky-300">对手球队</div>
            <label className="block text-xs text-slate-400">选择国家队</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none focus:border-sky-500/50"
              value={awayTeamId}
              onChange={(e) => handleTeamChange("away", e.target.value)}
            >
              {teamOptions.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <div className="mt-4">
              <BenchRoster side="away" />
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-white">突发场景模拟器</h3>
          <p className="mt-1 text-xs text-slate-500">
            主教练，遇到突发情况怎么办？
          </p>

          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-white/10 bg-slate-950/50 p-3 text-sm">
            {scenarioLog.length === 0 && !typewriterTarget && (
              <p className="text-xs text-slate-500">输入你的临场假设。</p>
            )}
            {scenarioLog.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "ml-8 border border-sky-500/20 bg-sky-500/10 text-sky-100"
                    : "mr-8 border border-[#00FF00]/20 bg-[#00FF00]/5 text-slate-100"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typewriterTarget && (
              <div className="typewriter-caret mr-8 rounded-lg border border-[#00FF00]/20 bg-[#00FF00]/5 px-3 py-2 text-xs leading-relaxed text-slate-100">
                {typewriterShown}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={scenarioInput}
              onChange={(e) => setScenarioInput(e.target.value)}
              placeholder="例如：落后一球怎么换人？"
              className="flex-1 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm outline-none focus:border-[#00FF00]/40"
              onKeyDown={(e) => {
                if (e.key === "Enter") void sendScenario();
              }}
            />
            <button
              type="button"
              disabled={scenarioBusy}
              onClick={() => void sendScenario()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00FF00]/40 bg-[#00FF00]/10 px-4 py-2 text-sm font-medium text-[#00FF00] hover:bg-[#00FF00]/20 disabled:opacity-50"
            >
              {scenarioBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              发送
            </button>
          </div>
        </section>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag?.scope === "bench" || activeDrag?.scope === "slot" ? (
          <WcPlayerCard player={activeDrag.player} variant="overlay" />
        ) : null}
      </DragOverlay>

      {invalidMsg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl border border-amber-500/40 bg-slate-950 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-amber-200">位置校验失败</h3>
            <p className="mt-2 text-sm text-slate-300">{invalidMsg}</p>
            <button
              type="button"
              className="mt-6 w-full rounded-lg border border-white/10 py-2 text-sm text-white hover:bg-white/5"
              onClick={() => setInvalidMsg(null)}
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </DndContext>
  );
}

function DraggableBenchCard({
  side,
  player,
  onClickToAdd,
}: {
  side: PitchSide;
  player: WcPlayer;
  onClickToAdd: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `bench-${side}-${player.id}`,
      data: { scope: "bench", side, player } satisfies BenchDrag,
    });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/bench relative ${isDragging ? "opacity-40" : ""}`}
    >
      <WcPlayerCard
        player={player}
        variant="roster"
        dragListeners={listeners}
        dragAttributes={attributes}
      />
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-xl opacity-0 transition hover:opacity-100"
        title={`点击将 ${player.name} 添加至首发阵容`}
        onClick={(e) => {
          e.stopPropagation();
          onClickToAdd();
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center rounded-xl bg-[#00FF00]/0 opacity-0 transition group-hover/bench:bg-[#00FF00]/8 group-hover/bench:opacity-100">
        <span className="rounded bg-slate-950/90 px-2 py-1 text-[10px] text-[#00FF00] shadow-lg">
          点击添加至首发
        </span>
      </div>
    </div>
  );
}
