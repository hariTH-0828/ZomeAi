import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import MainChat from './components/chat/MainChat';
import EmptyState from './components/chat/EmptyState';

export const models = [
  "GPT-OSS (GROQ)",
  "Qwen 3.5",
  "Kimi-K2.5"
];

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeModel, setActiveModel] = useState(models[0]);

  const handleCreateNewChat = () => {
    setActiveChat({ id: Date.now(), title: "New Chat", messages: [] });
  };

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
    >
      {activeChat ? <MainChat historyItems={historyItems} setHistoryItems={setHistoryItems} activeChat={activeChat} activeModel={activeModel} setActiveChat={setActiveChat} /> : <EmptyState activeModel={activeModel} setActiveChat={setActiveChat} />}
    </MainLayout>
  );
}

export default App;
