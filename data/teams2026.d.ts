import type { WcGroup, WcPlayer } from "../lib/wcTypes";

/** 类型声明：与 `teams2026.js` 同名的运行时代码配对 */
export const GROUPS_2026: WcGroup[];
export const PLAYERS_BY_TEAM: Record<string, WcPlayer[]>;
export function getTeamPlayers(teamId: string): WcPlayer[];
export function getTeamName(teamId: string): string;
export function getAllTeamOptions(): [string, string][];
