import { NextResponse } from "next/server";
import { getDeepseekClient, MODEL } from "@/lib/openaiClient";

export const runtime = "nodejs";

const SYSTEM = `你是国家队主教练的 AI 战术助理。根据给定的双方首发与阵型上下文，针对用户描述的突发赛况，给出可执行的临场调整：包括阵型收缩/前压、对位换人、定位球策略与节奏控制。回答使用中文，条理清晰，避免空泛口号。`;

const MOCK_SCENARIO =
  "先稳住节奏：将被罚下位置用替补后腰顶上，改 4-4-1 菱形保护中路；边锋回收协助边后卫，减少单防次数。若仍被压制，可撤一名前锋换中卫，改五后卫，利用反击边路与定位球寻找一次得分机会。";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, context } = body as {
      question?: string;
      context?: string;
    };

    if (!question?.trim()) {
      return NextResponse.json(
        { reply: MOCK_SCENARIO, mock: true },
        { status: 400 },
      );
    }

    const client = getDeepseekClient();
    if (!client) {
      return NextResponse.json({ reply: MOCK_SCENARIO, mock: true });
    }

    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `【阵容与背景】\n${context ?? "（无额外上下文）"}\n\n【突发情况】\n${question}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (!text) {
        return NextResponse.json({ reply: MOCK_SCENARIO, mock: true });
      }
      return NextResponse.json({ reply: text, mock: false });
    } catch {
      return NextResponse.json({ reply: MOCK_SCENARIO, mock: true });
    }
  } catch {
    return NextResponse.json({ reply: MOCK_SCENARIO, mock: true });
  }
}
