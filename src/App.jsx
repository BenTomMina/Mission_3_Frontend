import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [interviewStart, setInterviewStart] = useState(false);
  const [messages, setMessages] = useState([
    { role: "interviewer", text: "Tell me about yourself." },
  ]);
  const [input, setInput] = useState("");

  const handleStart = (e) => {
    e.preventDefault();
    if (name.trim() && jobTitle.trim()) {
      setInterviewStart(true);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: "me", text: input }]);
    setInput("");
  };
  return (
    <div className="appContainer">
      {!interviewStart ? (
        // Input form
        <form className="startForm" onSubmit={handleStart}>
          <h1>AI Mock Interview</h1>
          <input
            type="text"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title..."
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <button type="submit">Start Interview</button>
        </form>
      ) : (
        // Interview UI
        <div className="interviewBox">
          <h1>AI Mock Interview</h1>
          <p>
            <strong>Job Title:</strong> {jobTitle}
          </p>
          <div className="chatBox">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatMessage ${
                  msg.role === "me" ? "me" : "interviewer"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <form className="inputArea" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      ;
    </div>
  );
}

export default App;
