// pages/api/chatgpt.js
import { NextResponse } from "next/server";
import OpenAI from "openai";
export const POST = async (req: any) => {
  console.log( '低效率' );
  
  const { messages } = await req.json();
  return NextResponse.json({ body: '999000' }, { status: 200 });
  const openai = new OpenAI({
    apiKey: "sk-1TAgyyOUl0tf1IeI0877221fEdD34e168e06F10844Cb738f",
    baseURL: "https://api.xty.app/v1",
  });
  const text = `
  「角色 (Role):」 youtube脚本编写专家。
  「目标 (Objective):」 根据我提供的信息编写对应的youtube脚本。
  「情境 (Scenario):」 
    1. 一只猫瘸腿了，但是它的意志力很强，再一次举办的抓老鼠大赛中夺得第一名；
    2. 用轻松的语调编写；
  「解决方案 (Solution):」 与主题强相关，详细描述别一笔带过，让看的人不会云里雾里、莫名其妙；
  「步骤 (Steps):」 给出最优脚本。
  `;
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
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
