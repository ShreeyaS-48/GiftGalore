import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load app documentation
const APP_DOCS = fs.readFileSync(path.resolve("data/app-docs.txt"), "utf-8");

export async function getChatResponse(userMessage, conversationHistory = []) {
  try {
    const SYSTEM_PROMPT = `
You are a helpful, concise chatbot for the GiftGalore platform.
- Always give short, crisp answers (3–5 sentences max).
- Format responses in Markdown.
- Use bullet points (•), numbered lists (1., 2., 3.), and short paragraphs.
- Do not repeat full sentences from the documentation word-for-word; summarize instead.
- Only answer questions about GiftGalore’s features, usage, and troubleshooting.
- If unrelated, reply: "Sorry, I can only help with GiftGalore-related questions."
Here is GiftGalore documentation:
${APP_DOCS}
`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Groq API error:", err);
    if (err?.error?.code === "rate_limit_exceeded") {
      return "Sorry, your message is too long. Please shorten it.";
    }
    return "Sorry, I couldn't generate a response at this time.";
  }
}
