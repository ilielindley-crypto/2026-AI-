"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { WcPlayer } from "@/lib/wcTypes";

const ORDER: (keyof WcPlayer["stats"])[] = [
  "速度",
  "射门",
  "传球",
  "盘带",
  "防守",
  "力量",
];

const SHORT: Record<string, string> = {
  速度: "速",
  射门: "射",
  传球: "传",
  盘带: "带",
  防守: "防",
  力量: "力",
};

type Props = {
  player: WcPlayer;
  /** 名单区略窄；球场槽位更紧凑 */
  variant?: "roster" | "slot" | "overlay";
  className?: string;
  style?: React.CSSProperties;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
};

export function WcPlayerCard({
  player,
  variant = "roster",
  className = "",
  style,
  dragListeners,
  dragAttributes,
}: Props) {
  const compact = variant !== "roster";
  const isSlot = variant === "slot";

  return (
    <div
      {...dragAttributes}
      {...(dragListeners ?? {})}
      style={style}
        className={[
        "group relative overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] transition will-change-transform",
        variant === "overlay"
          ? "w-[220px]"
          : isSlot
            ? "w-[104px]"
            : "w-full min-w-[200px]",
        "hover:z-10 hover:scale-[1.03] hover:border-[#00FF00]/55 hover:shadow-[0_0_24px_rgba(0,255,0,0.18)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,255,0,0.06),transparent_40%,rgba(14,165,233,0.08))] opacity-80" />

      {isSlot ? (
        <div className="relative flex flex-col items-center gap-1 p-2">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={player.avatar}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-px text-center text-[8px] font-bold text-[#00FF00]">
              {player.position}
            </div>
          </div>
          <p
            className="w-full truncate text-center text-[10px] font-semibold leading-tight text-white"
            title={player.name}
          >
            {player.name}
          </p>
        </div>
      ) : (
        <>
          <div className="relative flex gap-2 p-2">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={player.avatar}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-center text-[9px] font-bold text-[#00FF00]">
                {player.position}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <p
                  className={`truncate font-semibold leading-tight text-white ${
                    compact ? "text-[10px]" : "text-xs"
                  }`}
                  title={player.name}
                >
                  {player.name}
                </p>
                <div className="shrink-0 rounded-md border border-[#00FF00]/40 bg-gradient-to-b from-[#00FF00]/25 to-emerald-600/20 px-1.5 py-0.5 text-center shadow-[0_0_12px_rgba(0,255,0,0.25)]">
                  <div className="text-[8px] font-medium uppercase tracking-wider text-emerald-100/90">
                    OVR
                  </div>
                  <div className="text-sm font-black leading-none text-[#00FF00]">
                    {player.ovr}
                  </div>
                </div>
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {player.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-sky-500/25 bg-sky-500/10 px-1 py-px text-[8px] text-sky-100/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {!compact && (
                <p className="mt-1 text-[9px] text-slate-500">
                  {player.age} 岁 · €{player.value}M
                </p>
              )}
            </div>
          </div>
          <div className="relative space-y-0.5 border-t border-white/10 px-2 pb-2 pt-1">
            {ORDER.map((k) => {
              const v = player.stats[k];
              return (
                <div key={k} className="flex items-center gap-1">
                  <span className="w-3 text-[8px] text-slate-500">{SHORT[k]}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-[#00FF00]"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[8px] tabular-nums text-slate-400">
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
