import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [interviewStart, setInterviewStart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const chatBoxRef = useRef(null);
  const BACKEND_URL = "http://localhost:3000/interview";

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = async (e) => {
    e.preventDefault();
    if (name.trim() && job.trim()) {
      setInterviewStart(true);
      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: job,
            userResponse: "",
          }),
        });

        const data = await res.json();
        if (data.response) {
          setMessages([{ role: "interviewer", text: data.response }]);
          setQuestionIndex(1);
        }
      } catch (err) {
        setMessages([
          { role: "interviewer", text: "Error connecting to server" },
        ]);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "me", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: job, userResponse: input }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages([
          ...newMessages,
          { role: "interviewer", text: data.response },
        ]);
        setQuestionIndex(questionIndex + 1);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "interviewer", text: "error connecting to server." },
      ]);
    }
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
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
          <button type="submit">Start Interview</button>
        </form>
      ) : (
        // Interview UI
        <div className="interviewBox">
          <h1>AI Mock Interview</h1>
          <p>
            <strong>Job Title:</strong> {job}
          </p>
          <div className="chatBox" ref={chatBoxRef}>
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
            <button type="submit" disabled={questionIndex >= 7}>
              Submit
            </button>
          </form>
        </div>
      )}
      ;
    </div>
  );
}

export default App;
