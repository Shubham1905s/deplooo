// src/components/MessageList.jsx
import { useEffect, useRef } from "react";

function renderMessageBody(text) {
  if (!text) return null;

  // ```lang\n...code...\n```
  const codeFence = text.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
  if (codeFence) {
    const [, lang = "", code] = codeFence;
    return (
      <pre className="code-block" data-lang={lang}>
        <code>{code}</code>
      </pre>
    );
  }

  // Heuristic: multiline or contains code-ish chars
  const looksLikeCode = /[\r\n\t{};<>]/.test(text);
  if (looksLikeCode) {
    return (
      <pre className="code-block">
        <code>{text}</code>
      </pre>
    );
  }

  // Plain text
  return <p className="text">{text}</p>;
}

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);
  const prevCount = useRef(0);

  useEffect(() => {
    if (messages.length !== prevCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      prevCount.current = messages.length;
    }
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((m) => (
        <div key={m.id} className="message">
          <div className="meta">
            <span className="user">{m.user || "Guest"}</span>
            <span className="time">
              {m.timestamp?.toDate ? m.timestamp.toDate().toLocaleString() : "sending..."}
            </span>
          </div>

          {renderMessageBody(m.text)}

          {m.fileUrl &&
            (m.fileType?.startsWith("image/") ? (
              <img className="image" src={m.fileUrl} alt="attachment" />
            ) : (
              <a className="file" href={m.fileUrl} target="_blank" rel="noreferrer">
                📎 Download file ({m.fileType || "file"})
              </a>
            ))}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
