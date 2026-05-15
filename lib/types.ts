export type Position = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  pos: Position;
  number?: number;
};

export type TeamMeta = {
  id: string;
  name: string;
  short: string;
};

export type TeamSquad = TeamMeta & {
  players: Player[];
};

export type PitchSide = "home" | "away";

export type SlotRole = Position;

export type LineupSlot = {
  role: SlotRole;
  label: string;
};

export type KeyMatchup = {
  playerA: string;
  playerB: string;
  analysis: string;
};

export type MatchupAnalysis = {
  winRateA: number;
  winRateB: number;
  keyMatchups: KeyMatchup[];
  summary: string;
};
