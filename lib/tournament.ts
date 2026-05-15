import { GROUPS_2026 } from "../data/teams2026.js";

export type TTeam = {
  id: string;
  name: string;
};

export type GroupRow = {
  letter: string;
  teams: TTeam[];
};

/** 2026 官方抽签 12 组（48 强）— 数据源自 `data/teams2026.js` */
export const GROUPS: GroupRow[] = GROUPS_2026 as GroupRow[];

export type BTeam = TTeam | null;

export type KnockoutMatch = {
  home: BTeam;
  away: BTeam;
  winner: BTeam;
};

export type GroupResult = {
  first: BTeam;
  second: BTeam;
  third: BTeam;
};

export type BracketState = {
  groupResults: Record<string, GroupResult>;
  bestThirds: BTeam[];
  r32: KnockoutMatch[];
  r16: KnockoutMatch[];
  qf: KnockoutMatch[];
  sf: KnockoutMatch[];
  final: KnockoutMatch;
  thirdPlace: KnockoutMatch;
};

export const R32_SLOTS: {
  homeRef: string;
  awayRef: string;
  homeLabel: string;
  awayLabel: string;
}[] = [
  { homeRef: "A1", awayRef: "B2", homeLabel: "A组第一", awayLabel: "B组第二" },
  { homeRef: "C1", awayRef: "D2", homeLabel: "C组第一", awayLabel: "D组第二" },
  { homeRef: "E1", awayRef: "F2", homeLabel: "E组第一", awayLabel: "F组第二" },
  { homeRef: "G1", awayRef: "H2", homeLabel: "G组第一", awayLabel: "H组第二" },
  { homeRef: "I1", awayRef: "J2", homeLabel: "I组第一", awayLabel: "J组第二" },
  { homeRef: "K1", awayRef: "L2", homeLabel: "K组第一", awayLabel: "L组第二" },
  { homeRef: "B1", awayRef: "A2", homeLabel: "B组第一", awayLabel: "A组第二" },
  { homeRef: "D1", awayRef: "C2", homeLabel: "D组第一", awayLabel: "C组第二" },
  { homeRef: "F1", awayRef: "E2", homeLabel: "F组第一", awayLabel: "E组第二" },
  { homeRef: "H1", awayRef: "G2", homeLabel: "H组第一", awayLabel: "G组第二" },
  { homeRef: "J1", awayRef: "I2", homeLabel: "J组第一", awayLabel: "I组第二" },
  { homeRef: "L1", awayRef: "K2", homeLabel: "L组第一", awayLabel: "K组第二" },
  { homeRef: "3RD1", awayRef: "3RD2", homeLabel: "最佳第三①", awayLabel: "最佳第三②" },
  { homeRef: "3RD3", awayRef: "3RD4", homeLabel: "最佳第三③", awayLabel: "最佳第三④" },
  { homeRef: "3RD5", awayRef: "3RD6", homeLabel: "最佳第三⑤", awayLabel: "最佳第三⑥" },
  { homeRef: "3RD7", awayRef: "3RD8", homeLabel: "最佳第三⑦", awayLabel: "最佳第三⑧" },
];

export function emptyBracketState(): BracketState {
  const gr: Record<string, GroupResult> = {};
  GROUPS.forEach((g) => {
    gr[g.letter] = { first: null, second: null, third: null };
  });
  return {
    groupResults: gr,
    bestThirds: [null, null, null, null, null, null, null, null],
    r32: R32_SLOTS.map(() => ({ home: null, away: null, winner: null })),
    r16: Array.from({ length: 8 }, () => ({ home: null, away: null, winner: null })),
    qf: Array.from({ length: 4 }, () => ({ home: null, away: null, winner: null })),
    sf: Array.from({ length: 2 }, () => ({ home: null, away: null, winner: null })),
    final: { home: null, away: null, winner: null },
    thirdPlace: { home: null, away: null, winner: null },
  };
}

export type RankedGroup = {
  letter: string;
  first: TTeam;
  second: TTeam;
  third: TTeam;
  fourth: TTeam;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function simulateGroupStage(): {
  ranked: RankedGroup[];
  bracket32: { home: TTeam; away: TTeam }[];
} {
  const ranked: RankedGroup[] = GROUPS.map((g) => {
    const [f, s, t, fo] = shuffle(g.teams);
    return { letter: g.letter, first: f, second: s, third: t, fourth: fo };
  });

  const thirds = ranked.map((r) => r.third);
  const best8 = shuffle(thirds).slice(0, 8);

  const pick = (letter: string, place: 1 | 2 | 3) => {
    const row = ranked.find((r) => r.letter === letter)!;
    if (place === 1) return row.first;
    if (place === 2) return row.second;
    return row.third;
  };

  const slots: { h: TTeam; a: TTeam }[] = [
    { h: pick("A", 1), a: pick("B", 2) },
    { h: pick("C", 1), a: pick("D", 2) },
    { h: pick("E", 1), a: pick("F", 2) },
    { h: pick("G", 1), a: pick("H", 2) },
    { h: pick("I", 1), a: pick("J", 2) },
    { h: pick("K", 1), a: pick("L", 2) },
    { h: pick("B", 1), a: pick("A", 2) },
    { h: pick("D", 1), a: pick("C", 2) },
    { h: pick("F", 1), a: pick("E", 2) },
    { h: pick("H", 1), a: pick("G", 2) },
    { h: pick("J", 1), a: pick("I", 2) },
    { h: pick("L", 1), a: pick("K", 2) },
    { h: best8[0], a: best8[1] },
    { h: best8[2], a: best8[3] },
    { h: best8[4], a: best8[5] },
    { h: best8[6], a: best8[7] },
  ];

  const bracket32 = slots.map((s) => ({ home: s.h, away: s.a }));
  return { ranked, bracket32 };
}

export const R32_PLACEHOLDER: { home: string; away: string }[] = [
  { home: "A组第一", away: "B组第二" },
  { home: "C组第一", away: "D组第二" },
  { home: "E组第一", away: "F组第二" },
  { home: "G组第一", away: "H组第二" },
  { home: "I组第一", away: "J组第二" },
  { home: "K组第一", away: "L组第二" },
  { home: "B组第一", away: "A组第二" },
  { home: "D组第一", away: "C组第二" },
  { home: "F组第一", away: "E组第二" },
  { home: "H组第一", away: "G组第二" },
  { home: "J组第一", away: "I组第二" },
  { home: "L组第一", away: "K组第二" },
  { home: "成绩最佳第三 1", away: "成绩最佳第三 2" },
  { home: "成绩最佳第三 3", away: "成绩最佳第三 4" },
  { home: "成绩最佳第三 5", away: "成绩最佳第三 6" },
  { home: "成绩最佳第三 7", away: "成绩最佳第三 8" },
];
