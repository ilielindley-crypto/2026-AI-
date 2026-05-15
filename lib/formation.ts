import type { WcPosition } from "./wcTypes";

/** 11 人槽位：门将 + 4 后卫 + 3 中场 + 3 前锋 */
export const DEFAULT_FORMATION_SLOTS: { role: WcPosition; label: string }[] = [
  { role: "GK", label: "门将" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "MF", label: "中场" },
  { role: "MF", label: "中场" },
  { role: "MF", label: "中场" },
  { role: "FW", label: "前锋" },
  { role: "FW", label: "前锋" },
  { role: "FW", label: "前锋" },
];
