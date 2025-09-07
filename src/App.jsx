// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { subscribeToMessages } from "./services/chatService";
import NotFound from "./pages/NotFound";
import "./App.css";

/**
 * Allowed semester ids. keep lowercased to simplify checks.
 * If you later change semester slugs, update this array.
 */
const SEMESTERS = ["all semester", "semester 1", "semester 2", "semester 3", "semester 4", "semester 5", "semester 6", "semester 7", "semester 8"];

function Home() {
  return (
    <div className="home">
      <h1>Jibber - An open Chat For All</h1>
      <div className="cards-container">
        {SEMESTERS.map((s) => (
          <div key={s} className="card-item">
            <h3>{s.toUpperCase()}</h3>
            <p>Join the chat for {s.toUpperCase()} Community</p>
            {/* fixed Link syntax by using template literal */}
            <Link to={`/${s}`}>
              <button>Enter Chat</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemesterChat() {
  const { semesterId } = useParams();
  // normalize for safety
  const slug = semesterId ? semesterId.toLowerCase() : "";

  // If semesterId is invalid, render NotFound (keeps URL shown as entered).
  // Alternative: return <Navigate to="/404" replace /> to change URL.
  if (!SEMESTERS.includes(slug)) {
    return <NotFound />;
  }

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // subscribeToMessages should return an unsubscribe function
    // We'll guard if it doesn't for safety.
    const unsub = subscribeToMessages(slug, { onData: setMessages });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [slug]);

  return (
    <div className="app">
      <header className="topbar">
        <h1>{slug.toUpperCase()} Chat</h1>
        <Link to="/">⬅ Back to Home</Link>
      </header>

      <MessageList messages={messages} />
      <MessageInput semesterId={slug} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* keep a single dynamic route but we validate inside SemesterChat */}
        <Route path="/:semesterId" element={<SemesterChat />} />

        {/* optional explicit 404 route */
        /* you can also redirect to /404 if you prefer URL change */ }
        <Route path="/404" element={<NotFound />} />

        {/* catch-all: handles deeper paths like /foo/bar */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}


