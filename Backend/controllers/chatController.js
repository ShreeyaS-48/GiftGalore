import { getChatResponse } from "../util/chat.js";

export const getResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: String(m.content ?? ""),
    }));
    const reply = await getChatResponse(formattedMessages);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
