import { useState} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';


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
      //= await axios.post("http://localhost:5000/chat", { message: input });
      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div className = 'chat' style={{display:"flex", flexFlow:"column", alignItems:"center"}}>
        <h2 style={{textAlign:"center", paddingTop:"5px", fontSize:"1.8rem"}}>Chat With Our Bot</h2>
        <div className = "chat-window" style ={{overflowY: "auto"}}>
            <div className="chat-messages" style={{width:"100%"}}>
                {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.sender}`}>
                    {m.text}
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
