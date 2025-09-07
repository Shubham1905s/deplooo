// src/services/chatService.js
import { db, storage } from "../firebase";
import {
  collection, doc, setDoc, query, orderBy, limit,
  onSnapshot, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Firestore data model:
 * /chats/{semesterId}/messages/{messageId}
 * message: { text, fileUrl, fileType, user, timestamp }
 */

export async function sendMessage(semesterId, { text, file, user }) {
  const messagesCol = collection(db, "chats", semesterId, "messages");
  // Pre-generate doc id so we can store file under it
  const msgRef = doc(messagesCol);

  let fileUrl = null;
  let fileType = null;

  if (file) {
    const fileRef = ref(storage, `chat-files/${semesterId}/${msgRef.id}/${file.name}`);
    await uploadBytes(fileRef, file);
    fileUrl = await getDownloadURL(fileRef);
    fileType = file.type;
  }

  await setDoc(msgRef, {
    text: text || null,
    fileUrl,
    fileType,
    user,                    // e.g. display name or auth uid
    timestamp: serverTimestamp(),
  });
}

export function subscribeToMessages(semesterId, { onData, pageSize = 200 }) {
  const messagesCol = collection(db, "chats", semesterId, "messages");
  const q = query(messagesCol, orderBy("timestamp", "asc"), limit(pageSize));
  const unsub = onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onData(messages);
  });
  return unsub;
}
