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

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 170) + "px";
  }, [text]);

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    const trimmed = text.replace(/\s+$/g, "");
    if (!trimmed && !file) return;
    await sendMessage(semesterId, {
      text: trimmed || null,
      file,
      user: name || "Guest",
    });
    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onKeyDown = (e) => {
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
        placeholder="Type a message…  (Shift+Enter for newline)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        spellCheck={false}
      />
      <label className="file-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,text/plain,application/json,application/xml"
          onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
          style={{ display: "none" }}
        />
        <span>
          {file ? file.name : "Choose File"}
        </span>
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
