import { NextResponse } from "next/server";
import OpenAI from "openai";
export const POST = async (req: any) => {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const body = messages[0].content;
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://api.xty.app/v1",
  });
  const text = `
  「角色 (Role):」 youtube脚本编写专家。
  「目标 (Objective):」 根据我提供的信息编写对应的youtube脚本。
  「情境 (Scenario):」 
    dot1
    dot2
  「解决方案 (Solution):」 与主题强相关，详细描述别一笔带过，让看的人不会云里雾里、莫名其妙；
  「步骤 (Steps):」 给出最优脚本。
  `;
  const newText = text
  .replace('dot1', body.textareaValue)
  .replace('dot2', body.selectedOption);
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: newText }],
      max_tokens: 10000,
    });

    return NextResponse.json({ body: stream.choices[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "failed to purchase boost pack" },
      { status: 500 }
    );
  }
};

export const GET = async (req: any) => {
  return NextResponse.json({ body: '999000' }, { status: 200 });
}