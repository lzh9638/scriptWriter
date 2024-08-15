import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async (req: any) => {
  const body = await req.json();
  const { prompt } = body;
  const parsedPrompt = JSON.parse(prompt);
  const { textareaValue, selectedOption, lang } = parsedPrompt;
  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://api.xty.app/v1",
  });
  const text = `
    「角色 (Role):」 youtube脚本编写专家。
    「目标 (Objective):」 根据我提供的信息编写对应的youtube脚本。
    「情境 (Scenario):」 
      ${textareaValue}
      ${selectedOption}
    「要求 (Requirements):」输出语言：${lang}
    「解决方案 (Solution):」 与主题强相关，详细描述别一笔带过，让看的人不会云里雾里、莫名其妙；
    「步骤 (Steps):」 给出最优脚本。
    `;
  try {
    const res: any = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
      stream: true,
      max_tokens: 10000,
    });
    const stream = OpenAIStream(res);
    return new StreamingTextResponse(stream);
  } catch (err) {
    return NextResponse.json(
      { error: "failed to purchase boost pack" },
      { status: 500 }
    );
  }
};

export const GET = async (req: any) => {
  return NextResponse.json({ body: "999000" }, { status: 200 });
};
