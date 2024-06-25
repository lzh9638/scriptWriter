// pages/api/chatgpt.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { messages } = req.body;
    // 处理消息并返回响应
    const response = await someChatGPTFunction(messages);
    res.status(200).json({ message: response });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

async function someChatGPTFunction(messages) {
  // 模拟处理消息的函数
  return `Response to: ${messages.map((msg) => msg.content).join(", ")}`;
}
