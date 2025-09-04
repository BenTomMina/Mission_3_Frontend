import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [interviewStart, setInterviewStart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [background, setBackground] = useState("");

  const chatBoxRef = useRef(null);

  // ✅ Backend URLs
  const BACKEND_URL = "http://localhost:3000";
  const INTERVIEW_URL = `${BACKEND_URL}/interview`;
  const BACKGROUND_URL = `${BACKEND_URL}/generate-background`;

  // Automatically scrolls the chat to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // To trigger the star of the interview
  const handleStart = async (e) => {
    e.preventDefault();
    if (name.trim() && job.trim()) {
      setInterviewStart(true);

      // 🔹 Generate background
      try {
        const bgRes = await fetch(BACKGROUND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle: job }),
        });
        const bgData = await bgRes.json();
        if (bgData.imageUrl) setBackground(bgData.imageUrl);
      } catch (err) {
        console.error("Background generation failed:", err);
      }

      // 🔹 Start Interview
      try {
        const res = await fetch(INTERVIEW_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: job,
            userResponse: `Hi my name is ${name} and I am applying for the ${job} role.`,
            name,
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

  // For sending messages to the interviewer
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "me", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(INTERVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ jobTitle: job, userResponse: input, name }),
        body: JSON.stringify({
          jobTitle: job,
          userResponse: input,
          name,
          history: newMessages.map((msg) => ({
            role: msg.role === "me" ? "user" : "interviewer",
            content: msg.text,
          })),
        }),
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
    // Container to display the generated background image
    <div
      className="appBody"
      style={{
        backgroundImage: background ? `url(${background})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overall container for the app */}
      <div className="appContainer">
        {!interviewStart ? (
          // Input form - inital display to prompt entry of name and job title
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
          // Interview UI - changes to this once the interview has been started
          <div className="interviewBox">
            <h1>AI Mock Interview</h1>
            <h4>
              <strong>Job Title:</strong> {job}
            </h4>
            {/* Displays all the messages between the interviewer and user */}
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

            {/* Entry point for the userResponse */}
            <form className="inputArea" onSubmit={handleSend}>
              <textarea
                placeholder="Response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                // Enables hitting the "enter" key to send rather than moving to the next line
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              {/* Disables message submission once interview ends */}
              <button type="submit" disabled={questionIndex >= 7}>
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
