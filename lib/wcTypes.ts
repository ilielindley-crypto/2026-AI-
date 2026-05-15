export type WcPosition = "GK" | "DF" | "MF" | "FW";

export type WcPlayerStats = {
  速度: number;
  射门: number;
  传球: number;
  盘带: number;
  防守: number;
  力量: number;
};

/** 2026 数据层统一球员模型（与 data/teams2026.js 对齐） */
export type WcPlayer = {
  id: string;
  name: string;
  position: WcPosition;
  age: number;
  /** 身价（百万欧元） */
  value: number;
  avatar: string;
  ovr: number;
  stats: WcPlayerStats;
  tags: [string, string, string];
};

export type WcTeamLite = { id: string; name: string };

export type WcGroup = { letter: string; teams: WcTeamLite[] };
