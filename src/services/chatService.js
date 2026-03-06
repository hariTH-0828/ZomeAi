import { db } from "./firebase";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

/**
 * Get the chats collection reference for a user
 */
const chatsRef = (userId) => collection(db, "users", userId, "chats");

/**
 * Load all chats for a user, ordered by most recently updated
 */
export const loadChats = async (userId) => {
    const q = query(chatsRef(userId), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/**
 * Save (create or update) a chat document
 */
export const saveChat = async (userId, chat) => {
    const chatDoc = doc(db, "users", userId, "chats", String(chat.id));
    await setDoc(chatDoc, {
        title: chat.title || "New Chat",
        model: chat.model || "",
        messages: chat.messages || [],
        createdAt: chat.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
    }, { merge: true });
};

/**
 * Delete a chat document
 */
export const deleteChat = async (userId, chatId) => {
    const chatDoc = doc(db, "users", userId, "chats", String(chatId));
    await deleteDoc(chatDoc);
};

/**
 * Update only the title of a chat
 */
export const updateChatTitle = async (userId, chatId, newTitle) => {
    const chatDoc = doc(db, "users", userId, "chats", String(chatId));
    await updateDoc(chatDoc, {
        title: newTitle,
        updatedAt: serverTimestamp(),
    });
};
