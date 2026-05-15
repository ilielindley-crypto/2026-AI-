import type { MatchupAnalysis } from "./types";

export const MOCK_MATCHUP: MatchupAnalysis = {
  winRateA: 58,
  winRateB: 42,
  keyMatchups: [
    {
      playerA: "中场核心 vs 对手扫荡",
      playerB: "对手边路快马",
      analysis:
        "我方双后腰能压缩中路空间，但对手边锋内切会拉扯我方边后卫，形成局部人数劣势。",
    },
    {
      playerA: "锋线支点",
      playerB: "中卫防空",
      analysis:
        "头球与二点球争夺决定阵地战效率；若对手中卫转身偏慢，我方影锋前插有穿透窗口。",
    },
    {
      playerA: "门将出球",
      playerB: "高位逼抢线",
      analysis:
        "后场出球链路一旦被掐断，容易被迫开大脚；建议边后卫拉边接应形成三角传递破解压迫。",
    },
  ],
  summary: "中场绞杀与边路转换的博弈，谁先犯错，比分就会开口说话。",
};

export function normalizeRates(a: MatchupAnalysis): MatchupAnalysis {
  const sum = a.winRateA + a.winRateB || 1;
  return {
    ...a,
    winRateA: Math.round((a.winRateA / sum) * 100),
    winRateB: Math.round((a.winRateB / sum) * 100),
  };
}
