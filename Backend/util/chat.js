import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import { encode } from "gpt-tokenizer"; // npm install gpt-tokenizer

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Load App Documentation ---
const APP_DOCS = fs.readFileSync("./data/app-docs.txt", "utf-8");

// --- Config ---
const MAX_CONTEXT_TOKENS = 8192; // llama3-8b limit
const MAX_TPM = 500000; // Tokens per minute limit
let tokensUsedThisMinute = 0;
let lastMinuteStart = Date.now();

// --- Token Counter ---
function countTokens(text) {
  return encode(text).length;
}

// --- Throttle Function ---
async function throttleIfNeeded(tokens) {
  const now = Date.now();
  if (now - lastMinuteStart > 60000) {
    // reset every minute
    tokensUsedThisMinute = 0;
    lastMinuteStart = now;
  }

  if (tokensUsedThisMinute + tokens > MAX_TPM) {
    const waitTime = 60000 - (now - lastMinuteStart);
    console.log(`Throttling... waiting ${waitTime}ms to avoid TPM limit.`);
    await new Promise((res) => setTimeout(res, waitTime));
    tokensUsedThisMinute = 0;
    lastMinuteStart = Date.now();
  }

  tokensUsedThisMinute += tokens;
}

// --- Get Chat Response ---
export async function getChatResponse(userMessage, conversationHistory = []) {
  // Prepare system message
  const SYSTEM_PROMPT = `
You are a chatbot for the GiftGalore platform. 
Only answer questions about GiftGalore’s features, usage, and troubleshooting.
If unrelated, reply: "Sorry, I can only help with GiftGalore-related questions."
Here is GiftGalore documentation:
${APP_DOCS}
`;

  // Add system + history + user
  let messages = [{ role: "system", content: SYSTEM_PROMPT }, ...conversationHistory, { role: "user", content: userMessage }];

  // Count total tokens
  let totalTokens = messages.reduce((sum, m) => sum + countTokens(m.content), 0);

  // If too long, trim oldest history messages
  while (totalTokens > MAX_CONTEXT_TOKENS - 500) { // keep buffer for response
    messages.splice(1, 1); // remove oldest non-system message
    totalTokens = messages.reduce((sum, m) => sum + countTokens(m.content), 0);
  }

  // Throttle if needed
  await throttleIfNeeded(totalTokens);

  // Send to Groq
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages
  });

  const reply = response.choices[0].message.content;
  const replyTokens = countTokens(reply);

  // Track usage
  await throttleIfNeeded(replyTokens);

  return reply;
}
