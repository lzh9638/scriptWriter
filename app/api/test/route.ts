import { NextResponse } from "next/server";
import OpenAI from "openai";
export const POST = async (req: any) => {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const body = messages[0].content;
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://hk.xty.app/v1",
  });
  const text = `
  「角色 (Role):」 youtube脚本编写专家。
  「目标 (Objective):」 根据我提供的信息编写对应的youtube脚本。
  「情境 (Scenario):」 
    dot1
    dot2
  「要求 (Requirements):」输出语言：dot3
  「解决方案 (Solution):」 与主题强相关，详细描述别一笔带过，让看的人不会云里雾里、莫名其妙；
  「步骤 (Steps):」 给出最优脚本。
  `;
  const newText = text
    .replace("dot1", body.textareaValue)
    .replace("dot2", body.selectedOption)
    .replace("dot3", body.lang);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: newText }],
      max_tokens: 10,
      stream: true,
    });

    // 开始写入HTTP响应
    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // 使用提供的 iterator 创建 ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        // 使用 response 的 iterator 读取数据
        const reader = response.iterator();

        async function push() {
          const { value, done } = await reader.next();
          if (done) {
            controller.close();
            return;
          }

          if (value !== undefined) {
            console.log(
              "测试===",
              typeof value === "object" && value instanceof Uint8Array
            );

            // 确保 value 是 Uint8Array 或者 string 类型
            if (typeof value === "object" && value instanceof Uint8Array) {
              controller.enqueue(value);
            } else if (typeof value === "string") {
              const uint8Array = new TextEncoder().encode(value);
              controller.enqueue(uint8Array);
            } else {
              console.error("Invalid value type:", value);
            }
          }

          push(); // 继续读取下一个块
        }

        push();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "failed to purchase boost pack" + err },
      { status: 500 }
    );
  }
};

export const GET = async (req: any) => {
  return NextResponse.json({ body: "999000" }, { status: 200 });
};
