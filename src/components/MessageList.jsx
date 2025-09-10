import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react"; // icons

// Helper to render message text (normal or code style, with truncation/expand)
function renderMessageBody(text, expanded) {
  if (!text) return null;
  const looksLikeCode = /[\r\n\t{};<>]/.test(text);

  if (looksLikeCode) {
    return (
      <pre className="code-block">
        <code>
          {expanded ? text : text.split("\n").slice(0, 10).join("\n")}
          {text.split("\n").length > 10 && !expanded && " ..."}
        </code>
      </pre>
    );
  }

  return (
    <p className="text">
      {expanded ? text : text.slice(0, 200)}
      {text.length > 200 && !expanded && " ..."}
    </p>
  );
}

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);
  const prevCount = useRef(0);

  // Copy state
  const [copiedId, setCopiedId] = useState(null);
  // Expanded messages
  const [expandedIds, setExpandedIds] = useState({});

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length !== prevCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      prevCount.current = messages.length;
    }
  }, [messages]);

  // Copy to clipboard
  const handleCopy = async (id, text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // reset after 2s
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Expand/collapse long messages
  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="message-list">
      {messages.map((m) => {
        const expanded = expandedIds[m.id] || false;
        return (
          <div
            key={m.id}
            className={`message${m.user === "Guest" ? "" : " self"}`}
          >
            <div className="meta">
              <span className="user">{m.user || "Guest"}</span>
              <span className="time">
                {m.timestamp?.toDate
                  ? m.timestamp.toDate().toLocaleString()
                  : "sending..."}
              </span>
            </div>

            {/* Text / Code */}
            {renderMessageBody(m.text, expanded)}

            {/* Show more/less */}
            {m.text &&
              (m.text.length > 200 || m.text.split("\n").length > 10) && (
                <button
                  className="show-more-btn"
                  onClick={() => toggleExpand(m.id)}
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}

            {/* Copy */}
            {m.text && (
              <button
                className="copy-btn"
                onClick={() => handleCopy(m.id, m.text)}
              >
                {copiedId === m.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}

            {/* Attachments */}
            {m.fileUrl &&
              (m.fileType?.startsWith("image/") ? (
                <img className="image" src={m.fileUrl} alt="attachment" />
              ) : (
                <a
                  className="file"
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📎 Download file ({m.fileType || "file"})
                </a>
              ))}
          </div>
        );
      })}

      {/* Bottom marker for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
