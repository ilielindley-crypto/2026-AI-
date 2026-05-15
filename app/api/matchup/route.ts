import { NextResponse } from "next/server";
import { getDeepseekClient, MODEL } from "@/lib/openaiClient";
import { MOCK_MATCHUP, normalizeRates } from "@/lib/mockAnalysis";
import type { MatchupAnalysis } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM = `你是一位顶级数据分析师。请评估这两套阵容的战局，并【必须严格以 JSON 格式输出】，JSON 结构需包含 winRateA (数字), winRateB (数字), keyMatchups (数组，每项含 playerA、playerB 和 analysis 字段表示对位分析), summary (字符串)。不要输出任何 JSON 之外的文字。`;

function safeParse(content: string): MatchupAnalysis | null {
  try {
    const cleaned = content.replace(/```json\n?|```/g, "").trim();
    const obj = JSON.parse(cleaned) as MatchupAnalysis;
    if (
      typeof obj.winRateA !== "number" ||
      typeof obj.winRateB !== "number" ||
      !Array.isArray(obj.keyMatchups) ||
      typeof obj.summary !== "string"
    ) {
      return null;
    }
    const km = obj.keyMatchups
      .filter(
        (k) =>
          k &&
          typeof k.playerA === "string" &&
          typeof k.playerB === "string" &&
          typeof k.analysis === "string",
      )
      .slice(0, 5);
    if (km.length < 3) return null;
    return normalizeRates({
      winRateA: obj.winRateA,
      winRateB: obj.winRateB,
      keyMatchups: km.slice(0, 3),
      summary: obj.summary,
    });
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamAName, teamBName, lineupA, lineupB } = body as {
      teamAName?: string;
      teamBName?: string;
      lineupA?: { name: string; pos: string }[];
      lineupB?: { name: string; pos: string }[];
    };

    if (!lineupA?.length || !lineupB?.length) {
      return NextResponse.json(
        { error: "缺少阵容数据", fallback: normalizeRates(MOCK_MATCHUP) },
        { status: 400 },
      );
    }

    const userPayload = JSON.stringify({
      teamA: teamAName ?? "主队",
      teamB: teamBName ?? "客队",
      lineupA,
      lineupB,
    });

    const client = getDeepseekClient();
    if (!client) {
      return NextResponse.json({
        data: normalizeRates(MOCK_MATCHUP),
        mock: true,
        reason: "no_api_key",
      });
    }

    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `基于以下结构化阵容进行推演（严禁使用图像识别，仅依据文本字段）：\n${userPayload}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.35,
      });
      const text = completion.choices[0]?.message?.content ?? "";
      const parsed = safeParse(text);
      if (!parsed) {
        return NextResponse.json({
          data: normalizeRates(MOCK_MATCHUP),
          mock: true,
          reason: "parse_error",
        });
      }
      return NextResponse.json({ data: parsed, mock: false });
    } catch {
      return NextResponse.json({
        data: normalizeRates(MOCK_MATCHUP),
        mock: true,
        reason: "timeout_or_upstream",
      });
    }
  } catch {
    return NextResponse.json({
      data: normalizeRates(MOCK_MATCHUP),
      mock: true,
      reason: "bad_request",
    });
  }
}
