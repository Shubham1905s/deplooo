// src/components/MessageInput.jsx
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/chatService";

export default function MessageInput({ semesterId, currentUser = "Guest" }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState(localStorage.getItem("displayName") || currentUser);
  const fileInputRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("displayName", name);
  }, [name]);

  // autosize the textarea a bit (nice for code)
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [text]);

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    const trimmed = text.replace(/\s+$/g, ""); // keep newlines but trim trailing spaces
    if (!trimmed && !file) return;

    await sendMessage(semesterId, {
      text: trimmed || null, // preserve newlines and tabs
      file,
      user: name || "Guest",
    });

    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onKeyDown = (e) => {
    // Enter to send, Shift+Enter for newline (Slack-style)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form className="message-input" onSubmit={onSubmit}>
      <input
        className="name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        ref={textRef}
        className="text"
        placeholder="Type a message…  (Shift+Enter = newline)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        spellCheck={false}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,text/plain,application/json,application/xml"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button type="submit">Send</button>
    </form>
  );
}
