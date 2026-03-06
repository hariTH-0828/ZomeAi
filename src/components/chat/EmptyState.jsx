import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveChat } from '../../services/chatService';

const EmptyState = ({ activeModel, setActiveChat, user }) => {
    const [attachOpen, setAttachOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const attachRef = useRef(null);
    const mediaInputRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (attachRef.current && !attachRef.current.contains(event.target)) {
                setAttachOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMediaClick = () => {
        setAttachOpen(false);
        mediaInputRef.current?.click();
    };

    const handleCodeClick = () => {
        setAttachOpen(false);
        fileInputRef.current?.click();
    };

    const handleSend = () => {
        if (!inputValue.trim() || !setActiveChat) return;
        const newChat = {
            id: Date.now(),
            title: inputValue.slice(0, 30),
            model: activeModel,
            messages: [{ role: "user", content: inputValue }]
        };
        setActiveChat(newChat);

        // Persist to Firestore
        if (user?.uid) {
            saveChat(user.uid, newChat).catch(console.error);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0f1117] transition-colors relative h-full">
            <div className="flex flex-col items-center justify-center max-w-2xl w-full flex-1 -mt-20">
                <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight text-center mb-12">
                    {user?.displayName ? `Hi ${user.displayName.split(' ')[0]}, how can I help?` : 'Good to see you here.'}
                </h1>

                <div className="w-full relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full p-2 pl-4 transition-shadow focus-within:shadow-md focus-within:border-indigo-300 dark:focus-within:border-indigo-500">

                    {/* Hidden file inputs */}
                    <input type="file" ref={mediaInputRef} className="hidden" accept="image/*,video/*" multiple />
                    <input type="file" ref={fileInputRef} className="hidden" accept=".js,.jsx,.ts,.tsx,.json,.md,.html,.css,.py,.txt,.java,.swift,.kt,.c,.cpp,.cs,.go,.rb,.php,.rs,.scala,.sh,.bash,.zsh,.fish,.ksh,.csh" multiple />

                    <div className="relative" ref={attachRef}>
                        <button
                            onClick={() => setAttachOpen(!attachOpen)}
                            className={`p-2 transition-colors shrink-0 rounded-full mr-2 cursor-pointer ${attachOpen ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <AnimatePresence>
                            {attachOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full left-0 mb-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 overflow-hidden text-slate-700 dark:text-slate-200"
                                >
                                    <button
                                        onClick={handleMediaClick}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors cursor-pointer"
                                    >
                                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-1.5 rounded-md">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                        Attach media
                                    </button>
                                    <button
                                        onClick={handleCodeClick}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors cursor-pointer"
                                    >
                                        <div className="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 p-1.5 rounded-md">
                                            <Code2 className="w-4 h-4" />
                                        </div>
                                        Upload code
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSend();
                        }}
                        placeholder="Ask anything"
                        className="flex-1 bg-transparent px-2 py-3 text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    />

                    <button
                        onClick={handleSend}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all w-12 h-12 flex items-center justify-center shadow-md ml-2 shrink-0 cursor-pointer active:scale-90 hover:shadow-lg"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-0.5 mt-0.5">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmptyState;
