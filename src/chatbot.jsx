import { useState, useEffect } from "react";
import policiesData from "./data/policies.json";
import Fuse from "fuse.js";

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me about government policies, budget plans, or public spending.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [policies, setPolicies] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    setPolicies(policiesData);
    const options = {
      keys: ["question", "category"],
      threshold: 0.3 // Adjust based on desired sensitivity
    };
    setFuse(new Fuse(policiesData, options));
  }, []);

  const getResponse = (question) => {
    if (!fuse) return null;
    const results = fuse.search(question);
    return results.length ? results[0].item : null;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    const response = getResponse(input);

    let botMessages = [];

    if (response) {
      botMessages.push({ text: response.answer, sender: "bot" });

      if (response.source) {
        botMessages.push({ text: `For more details, visit: ${response.source}`, sender: "bot" });
      }
    } else {
      botMessages.push({ text: "Sorry, I don't have information on that. Try asking about recent tax policies or budget plans.", sender: "bot" });
    }

    setMessages([...messages, userMessage, ...botMessages]);
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "20px", maxWidth: "500px", margin: "20px auto" }}>
      <div style={{ height: "300px", overflowY: "auto", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about policies, budget, or spending..."
        style={{ width: "75%", padding: "8px", marginTop: "10px" }}
      />
      <button onClick={handleSend} style={{ padding: "8px", marginLeft: "10px" }}>Send</button>
    </div>
  );
}

export default Chatbot;
