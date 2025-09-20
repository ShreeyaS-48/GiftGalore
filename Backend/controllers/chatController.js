import { getChatResponse } from "../util/chat.js";

export const getResponse =  async (req, res) => {
    try {
      const { message } = req.body;
      const reply = await getChatResponse(message);
      res.json({ reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
};