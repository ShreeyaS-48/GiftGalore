import { useState} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ReactMarkdown from "react-markdown";
function formatBotResponse(text) {
  return text.replace(/(\d+\.)/g, "\n$1"); // ensures lists start on new lines
}


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


 
  const axiosPrivate = useAxiosPrivate();
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    
    try {
      const res = await axiosPrivate.post(`/chat`, {message:input});
      const botMessage =  { sender: "bot", text: formatBotResponse(res.data.reply) };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not reach chatbot." }
    ]);
    }

    setInput("");
  };

  return (
    <div className = 'chat' style={{display:"flex", flexFlow:"column", alignItems:"center"}}>
        <h2 style={{textAlign:"center", paddingTop:"5px", fontSize:"1.8rem"}}>Chat With Our Bot</h2>
        <p style={{ textAlign:"center", paddingBottom:"10px"}}>I'm your GiftGalore chatbot. I'm here to help you with any questions or concerns you may have about GiftGalore's features, usage, and troubleshooting. </p>
        <div className = "chat-window" style ={{overflowY: "auto"}}>
            <div className="chat-messages" style={{width:"100%"}}>
                {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.sender}`}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
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
}
export default ChatBot;
