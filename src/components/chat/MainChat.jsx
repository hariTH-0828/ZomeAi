import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { chatCompletion } from '../../services/api';
import { saveChat } from '../../services/chatService';

const MainChat = ({ historyItems, setHistoryItems, activeChat, activeModel, setActiveChat, user }) => {
    const [messages, setMessages] = useState(activeChat?.messages || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMessages(activeChat?.messages || []);
    }, [activeChat?.id]);

    useEffect(() => {
        const fetchInitialResponse = async () => {
            if (activeChat?.messages?.length === 1 && messages.length === 1 && !isLoading) {
                setIsLoading(true);

                // Pre-add empty assistant message for streaming
                setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

                try {
                    const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
                    const reply = await chatCompletion(apiMessages, activeModel, (chunk) => {
                        setMessages(prev => {
                            const newMsgs = [...prev];
                            newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: chunk };
                            return newMsgs;
                        });
                    });

                    const updatedMessages = [...messages, { role: 'assistant', content: reply }];

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

                    // Persist to Firestore
                    if (user?.uid) {
                        saveChat(user.uid, { ...updatedChat, model: activeModel }).catch((err) => {
                            console.error('Failed to save chat after AI response:', err);
                        });
                    }

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
        // Immediately show user message + empty assistant placeholder for streaming
        const streamMessages = [...messages, newUserMsg, { role: 'assistant', content: '' }];
        setMessages(streamMessages);
        setIsLoading(true);

        const updatedChatUser = { ...activeChat, messages: [...messages, newUserMsg] };
        setActiveChat(updatedChatUser);

        setHistoryItems(prev => {
            const exists = prev.find(c => c.id === activeChat.id);
            if (exists) {
                return prev.map(c => c.id === activeChat.id ? updatedChatUser : c);
            }
            return [updatedChatUser, ...prev];
        });

        try {
            const apiMessages = [...messages, newUserMsg].map(m => ({ role: m.role, content: m.content }));
            const reply = await chatCompletion(apiMessages, activeModel, (chunk) => {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: chunk };
                    return newMsgs;
                });
            });

            const finalMessages = [...messages, newUserMsg, { role: 'assistant', content: reply }];
            setMessages(finalMessages);

            const finalChat = { ...activeChat, messages: finalMessages };
            setActiveChat(finalChat);

            setHistoryItems(prev => {
                return prev.map(c => c.id === activeChat.id ? finalChat : c);
            });

            // Persist to Firestore
            if (user?.uid) {
                saveChat(user.uid, { ...finalChat, model: activeModel }).catch((err) => {
                    console.error('Failed to save chat:', err);
                });
            }

        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditMessage = async (index, newContent) => {
        const editedMsg = { ...messages[index], content: newContent };
        let newMessages = [...messages];

        if (editedMsg.role === 'user') {
            // Cut off history after this user message to resend
            const baseMessages = messages.slice(0, index);
            const newMessages = [...baseMessages, editedMsg];
            // Setup streaming state
            setMessages([...newMessages, { role: 'assistant', content: '' }]);
            setIsLoading(true);

            // Update chat immediately
            const updatedChatUser = { ...activeChat, messages: newMessages };
            setActiveChat(updatedChatUser);
            setHistoryItems(prev => prev.map(c => c.id === activeChat.id ? updatedChatUser : c));

            try {
                const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
                const reply = await chatCompletion(apiMessages, activeModel, (chunk) => {
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: chunk };
                        return newMsgs;
                    });
                });

                const finalMessages = [...newMessages, { role: 'assistant', content: reply }];
                setMessages(finalMessages);

                const finalChat = { ...activeChat, messages: finalMessages };
                setActiveChat(finalChat);

                setHistoryItems(prev => prev.map(c => c.id === activeChat.id ? finalChat : c));

                if (user?.uid) {
                    saveChat(user.uid, { ...finalChat, model: activeModel }).catch(console.error);
                }
            } catch (e) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
            } finally {
                setIsLoading(false);
            }

        } else {
            // Just update the assistant message locally
            newMessages[index] = editedMsg;
            setMessages(newMessages);
            const finalChat = { ...activeChat, messages: newMessages };
            setActiveChat(finalChat);
            setHistoryItems(prev => prev.map(c => c.id === activeChat.id ? finalChat : c));
            if (user?.uid) {
                saveChat(user.uid, { ...finalChat, model: activeModel }).catch(console.error);
            }
        }
    };

    const handleReloadMessage = async (index) => {
        // Find the last user message BEFORE or AT this assistant message to regenerate from
        // If the user regenerates an AI message, we slice the history up to the previous user message
        const targetUserIndex = index - 1;
        if (targetUserIndex < 0 || messages[targetUserIndex].role !== 'user') return;

        let newMessages = messages.slice(0, targetUserIndex + 1);
        // Add empty streaming placeholder
        setMessages([...newMessages, { role: 'assistant', content: '' }]);
        setIsLoading(true);

        const updatedChatUser = { ...activeChat, messages: newMessages };
        setActiveChat(updatedChatUser);
        setHistoryItems(prev => prev.map(c => c.id === activeChat.id ? updatedChatUser : c));

        try {
            const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
            const reply = await chatCompletion(apiMessages, activeModel, (chunk) => {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: chunk };
                    return newMsgs;
                });
            });

            const finalMessages = [...newMessages, { role: 'assistant', content: reply }];
            setMessages(finalMessages);

            const finalChat = { ...activeChat, messages: finalMessages };
            setActiveChat(finalChat);

            setHistoryItems(prev => prev.map(c => c.id === activeChat.id ? finalChat : c));

            if (user?.uid) {
                saveChat(user.uid, { ...finalChat, model: activeModel }).catch(console.error);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-transparent relative transition-colors">
            <div className="flex-1 overflow-hidden flex flex-col relative z-0">
                <MessageList messages={messages} isLoading={isLoading} user={user} activeChat={activeChat} onEditSubmit={handleEditMessage} onReloadSubmit={handleReloadMessage} />
                <div className="shrink-0 relative z-10 w-full bg-white/70 dark:bg-[#0f1117]/70 backdrop-blur-xl">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default MainChat;
