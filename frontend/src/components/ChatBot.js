import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReactMarkdown from "react-markdown";
function formatBotResponse(text) {
  return text.replace(/(\d+\.)/g, "\n$1"); // ensures lists start on new lines
}

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    // Load saved messages when component mounts
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem("chatMessages", JSON.stringify(msgs));
  };
  const axiosPrivate = useAxiosPrivate();
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    try {
      const res = await axiosPrivate.post(`/chat`, {
        messages: updatedMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: String(msg.text ?? ""),
        })),
      });
      const botMessage = {
        sender: "assistant",
        text: formatBotResponse(res.data.reply),
      };
      setMessages((prev) => [...prev, botMessage]);
      saveMessages([...updatedMessages, botMessage]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Error: Could not reach chatbot." },
      ]);
      saveMessages([
        ...updatedMessages,
        { sender: "assistant", text: "Error: Could not reach chatbot." },
      ]);
    }

    setInput("");
  };

  return (
    <div
      className="chat"
      style={{ display: "flex", flexFlow: "column", alignItems: "center" }}
    >
      <h2
        style={{ textAlign: "center", paddingTop: "5px", fontSize: "1.8rem" }}
      >
        Chat With Our Bot
      </h2>
      <p style={{ textAlign: "center", paddingBottom: "10px" }}>
        I'm your GiftGalore chatbot. I'm here to help you with any questions or
        concerns you may have about GiftGalore's features, usage, and
        troubleshooting.{" "}
      </p>
      <div className="chat-window" style={{ overflowY: "auto" }}>
        <div className="chat-messages" style={{ width: "100%" }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.sender}`}>
              <ReactMarkdown
                children={m.text}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              />
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};
export default ChatBot;
