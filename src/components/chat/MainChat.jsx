import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { chatCompletion } from '../../services/api';

const MainChat = ({ historyItems, setHistoryItems, activeChat, activeModel, setActiveChat }) => {
    const [messages, setMessages] = useState(activeChat?.messages || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMessages(activeChat?.messages || []);
    }, [activeChat?.id]);

    useEffect(() => {
        const fetchInitialResponse = async () => {
            if (activeChat?.messages?.length === 1 && messages.length === 1 && !isLoading) {
                setIsLoading(true);
                try {
                    const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
                    const reply = await chatCompletion(apiMessages, activeModel);
                    const updatedMessages = [...messages, { role: 'assistant', content: reply }];
                    setMessages(updatedMessages);

                    // Update global chat state
                    const updatedChat = { ...activeChat, messages: updatedMessages };
                    setActiveChat(updatedChat);

                    // Add to history if new
                    setHistoryItems(prev => {
                        const exists = prev.find(c => c.id === activeChat.id);
                        if (exists) {
                            return prev.map(c => c.id === activeChat.id ? updatedChat : c);
                        }
                        return [updatedChat, ...prev];
                    });

                } catch (e) {
                    setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchInitialResponse();
    }, [messages.length, activeChat?.id]);

    const handleSendMessage = async (text) => {
        const newUserMsg = { role: 'user', content: text };
        const newMessages = [...messages, newUserMsg];
        setMessages(newMessages);
        setIsLoading(true);

        const updatedChatUser = { ...activeChat, messages: newMessages };
        setActiveChat(updatedChatUser);

        setHistoryItems(prev => {
            const exists = prev.find(c => c.id === activeChat.id);
            if (exists) {
                return prev.map(c => c.id === activeChat.id ? updatedChatUser : c);
            }
            return [updatedChatUser, ...prev];
        });

        try {
            const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
            const reply = await chatCompletion(apiMessages, activeModel);
            const finalMessages = [...newMessages, { role: 'assistant', content: reply }];
            setMessages(finalMessages);

            const finalChat = { ...activeChat, messages: finalMessages };
            setActiveChat(finalChat);

            setHistoryItems(prev => {
                return prev.map(c => c.id === activeChat.id ? finalChat : c);
            });

        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-transparent relative transition-colors">
            <div className="flex-1 overflow-hidden flex flex-col relative z-0">
                <MessageList messages={messages} isLoading={isLoading} />
                <div className="shrink-0 relative z-10 w-full bg-gradient-to-t from-white via-white dark:from-[#0f1117] dark:via-[#0f1117] to-transparent pt-4">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default MainChat;
