import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/chatService";

// ✅ new emoji-mart v5 imports
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function MessageInput({ semesterId, currentUser = "Guest" }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState(localStorage.getItem("displayName") || currentUser);
  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef(null);
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

  // ✅ click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);



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

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
    // ❌ remove this: setShowEmoji(false);
    // ✅ keep picker open for multiple emoji selections
  };

  return (
    <form className="message-input" onSubmit={onSubmit}>
      <input
        className="name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="text-with-emoji">
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
        <button
          type="button"
          className="emoji-toggle"
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          😀
        </button>

        {showEmoji && (
          <div ref={pickerRef} className="emoji-picker">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>

      <label className="file-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,text/plain,application/json,application/xml"
          onChange={(e) =>
            setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)
          }
          style={{ display: "none" }}
        />
        <span>{file ? file.name : "Choose File"}</span>
      </label>
      <button type="submit">Send</button>
    </form>
  );
}


