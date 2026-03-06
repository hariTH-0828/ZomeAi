import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Image as ImageIcon, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = ({ onSend, isLoading }) => {
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
        if (!inputValue.trim() || isLoading) return;
        onSend(inputValue);
        setInputValue("");
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-2 transition-shadow focus-within:shadow-md focus-within:border-indigo-300 dark:focus-within:border-indigo-500">

                    {/* Hidden file inputs */}
                    <input type="file" ref={mediaInputRef} className="hidden" accept="image/*,video/*" multiple />
                    <input type="file" ref={fileInputRef} className="hidden" accept=".js,.jsx,.ts,.tsx,.json,.md,.html,.css,.py,.txt" multiple />

                    <div className="relative" ref={attachRef}>
                        <button
                            onClick={() => setAttachOpen(!attachOpen)}
                            className={`p-1.5 transition-colors shrink-0 rounded-full ml-1 cursor-pointer ${attachOpen ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
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
                        disabled={isLoading}
                        placeholder={isLoading ? "Generating response..." : "Ask anything"}
                        className="flex-1 bg-transparent px-3 py-2 ml-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
                    />

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className={`p-2 rounded-full transition-all w-10 h-10 flex items-center justify-center shadow-md text-white ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-90 hover:shadow-lg'}`}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="text-center mt-3 text-xs text-slate-400/80 dark:text-slate-500">
                    ZOMI Ai can make mistakes. Check our Terms & Conditions.
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
