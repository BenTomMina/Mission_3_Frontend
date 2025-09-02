import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [interviewStart, setInterviewStart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Predefined questions for testing
  const questions = [
    `Hi ${name}. Please tell me about yourself?`,
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
    "Question 6",
    "Summary",
  ];

  const handleStart = (e) => {
    e.preventDefault();
    if (name.trim() && jobTitle.trim()) {
      setInterviewStart(true);
      setMessages([{ role: "interviewer", text: questions[0] }]);
      setQuestionIndex(0);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "me", text: input }];
    setMessages(newMessages);
    setInput("");

    // Next question (if available)
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { role: "interviewer", text: questions[nextIndex] },
        ]);
        setQuestionIndex(nextIndex);
      }, 800);
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
            <button
              type="submit"
              disabled={questionIndex >= questions.length - 1}
            >
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
