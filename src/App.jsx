import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { subscribeToMessages } from "./services/chatService";
import NotFound from "./pages/NotFound";
import "./App.css";

// Semester communities now include slug (URL) and name (display)
const SEMESTERS = [
  { slug: "for-every-fellas", name: "For Every Fellas" },
  { slug: "cyber-security", name: "Cyber Security" },
  { slug: "software-testing", name: "Software Testing" },
  { slug: "dsv", name: "DSV" },
];

// ✅ Home Page
function Home() {
  return (
    <div className="home">
      <h1>Jibber - An open Chat For All</h1>
      <div className="cards-container">
        {SEMESTERS.map((s) => (
          <div key={s.slug} className="card-item">
            <h3>{s.name.toUpperCase()}</h3>
            <p>Join the chat for {s.name.toUpperCase()} Community</p>
            <Link to={`/${s.slug}`}>
              <button>Enter Chat</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Semester Chat Page
function SemesterChat() {
  const { semesterId } = useParams();
  const semester = SEMESTERS.find((s) => s.slug === semesterId);
  if (!semester) return <NotFound />;

  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = subscribeToMessages(semester.slug, { onData: setMessages });
    return () => unsub?.();
  }, [semester.slug]);

  const filtered = messages.filter(
    (m) =>
      m.text?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="topbar">
        <h1>{semester.name.toUpperCase()} Chat</h1>
        <input
          className="search-box"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/">⬅ Back</Link>
      </header>

      <MessageList messages={filtered} />
      <MessageInput semesterId={semester.slug} />
    </div>
  );
}

// ✅ Footer Component (moved outside App)
function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Shubham. All rights reserved.</p>
      <a href="mailto:shubhammirashi303@gmail.com" className="footer-email">
        shubhammirashi303@gmail.com
      </a>
    </footer>
  );
}

// ✅ Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:semesterId" element={<SemesterChat />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer at the bottom */}
      <Footer />
    </Router>
  );
}
