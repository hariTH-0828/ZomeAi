import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import MainChat from './components/chat/MainChat';
import EmptyState from './components/chat/EmptyState';
import Login from './components/auth/Login';
import { useAuth } from './hooks/useAuth';

export const models = [
  "GPT-OSS (GROQ)",
  "Qwen 3.5",
  "Kimi-K2.5"
];

function App() {
  const { user, loading } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeModel, setActiveModel] = useState(models[0]);

  const handleCreateNewChat = () => {
    setActiveChat({ id: Date.now(), title: "New Chat", messages: [] });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0f1117]">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <MainLayout
      historyItems={historyItems}
      setHistoryItems={setHistoryItems}
      activeChat={activeChat}
      setActiveChat={setActiveChat}
      handleCreateNewChat={handleCreateNewChat}
      activeModel={activeModel}
      setActiveModel={setActiveModel}
      models={models}
      user={user}
    >
      {activeChat ? <MainChat historyItems={historyItems} setHistoryItems={setHistoryItems} activeChat={activeChat} activeModel={activeModel} setActiveChat={setActiveChat} /> : <EmptyState activeModel={activeModel} setActiveChat={setActiveChat} />}
    </MainLayout>
  );
}

export default App;
