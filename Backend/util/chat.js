import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------- Load and parse products ----------
const RAW_DATA = fs.readFileSync(path.resolve("data/app-docs.txt"), "utf-8");
let PRODUCTS = [];

try {
  PRODUCTS = JSON.parse(RAW_DATA);
} catch (err) {
  console.error("Failed to parse app-docs.txt as JSON:", err);
  PRODUCTS = [];
}

// ---------- Format products into text with links ----------
function formatProduct(p) {
  const oid = p._id?.$oid || "unknown";
  return `**Product:** ${p.title}
**Details:** ${p.details}
**Type:** ${p.type}
**Price:** ₹${p.price}
**Ratings:** ${p.ratings}
[Shop now](/${oid})
`;
}
//[Product Image](${p.imgURL})

const PRODUCT_TEXTS = PRODUCTS.map(formatProduct);

// ---------- Load FAQs ----------
const RAW_FAQS = fs.readFileSync(path.resolve("data/faqs.txt"), "utf-8");
// Each FAQ separated by double newlines or you can adjust the split
const FAQ_TEXTS = RAW_FAQS.split(/\n\s*\n/).map(
  (faq) => `**FAQ:** ${faq.trim()}`
);

// ---------- Combine docs ----------
const ALL_TEXTS = [...PRODUCT_TEXTS, ...FAQ_TEXTS];

// ---------- Initialize embeddings ----------
let embedder;
let DOC_EMBEDDINGS = [];

async function initEmbedder() {
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  for (const text of ALL_TEXTS) {
    const vector = await getEmbedding(text);
    DOC_EMBEDDINGS.push({ text, vector });
  }
}

async function getEmbedding(text) {
  const embeddingTensor = await embedder(text);

  const array =
    embeddingTensor.data instanceof Float32Array
      ? Array.from(embeddingTensor.data)
      : embeddingTensor.data.flat?.() || [];

  if (array.length === 0)
    throw new Error("Failed to extract embedding array from tensor");

  return array;
}

// ---------- Cosine similarity ----------
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

function retrieveTopChunks(queryVector, topK = 3) {
  return DOC_EMBEDDINGS.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryVector, chunk.vector),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ---------- Main chat function ----------
export async function getChatResponse(conversation = []) {
  try {
    const userMessage = conversation[conversation.length - 1]?.content || "";
    const queryVector = await getEmbedding(userMessage);
    const topChunks = retrieveTopChunks(queryVector);
    const SYSTEM_PROMPT = `
    You MUST only suggest products present in the provided documents. 
    Do NOT invent any products. 
    Always give the product name , details, price, link.
You are a helpful, concise chatbot for the GiftGalore platform.
- Always give short, crisp answers(3-5 lines max).
- Format responses in Markdown.
- Use:
  - Numbered lists 
  - Bulleted lists 
  - Bold for emphasis
  - Italics for secondary emphasis
- Answer FAQs if relevant.
- Do not repeat full sentences from the documentation word-for-word; summarize instead.
- Only answer questions about GiftGalore’s features, usage, products, and FAQs.
- If unrelated, reply: "Sorry, I can only help with GiftGalore-related questions."
Here are the most relevant documents:
${topChunks.map((c) => c.text).join("\n\n")}
`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversation,
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Groq API error:", err);
    return "Sorry, I couldn't generate a response at this time.";
  }
}

// ---------- Startup ----------
await initEmbedder();
