import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, Mic, Send, Image as ImageIcon, Code2, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = ({ onSend, isLoading }) => {
    const [attachOpen, setAttachOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const attachRef = useRef(null);
    const mediaInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

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

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachedFiles(prev => [...prev, ...files]);
        }
        // Reset input so the same file can be selected again if removed
        e.target.value = null;
    };

    const removeFile = (indexToRemove) => {
        setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSend = () => {
        if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) return;

        // Pass both text and files to parent (you'd need to handle files in MainChat, 
        // but for now we just clear them on send to simulate it)
        onSend(inputValue, attachedFiles);
        setInputValue("");
        setAttachedFiles([]);

        // Reset textarea height after sending
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = useCallback((e) => {
        const target = e.target;
        // Reset height to auto to correctly measure scrollHeight down
        target.style.height = 'auto';
        // Set new height based on content, with a max height
        const newHeight = Math.min(target.scrollHeight, 200); // Max height 200px
        target.style.height = `${newHeight}px`;
        setInputValue(target.value);
    }, []);

    return (
        <div className="p-3 transition-colors">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex flex-col bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-700 shadow-[0_2px_15px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_15px_rgb(0,0,0,0.2)] rounded-3xl p-3 transition-shadow focus-within:shadow-md focus-within:border-indigo-300 dark:focus-within:border-indigo-500">

                    {/* Hidden file inputs */}
                    <input type="file" ref={mediaInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*" multiple />
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".js,.jsx,.ts,.tsx,.json,.md,.html,.css,.py,.txt" multiple />

                    {/* Attached Files Preview */}
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2">
                            {attachedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-3 bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-slate-700 rounded-xl p-2 pr-3 shadow-sm group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        {file.type.startsWith('image/') ? (
                                            <ImageIcon className="w-5 h-5" />
                                        ) : (
                                            <FileText className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="flex flex-col max-w-[150px]">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {file.type ? file.type.split('/')[1]?.toUpperCase() || 'FILE' : 'FILE'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="ml-1 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center">
                        <div className="relative ml-2" ref={attachRef}>
                            <button
                                onClick={() => setAttachOpen(!attachOpen)}
                                className={`transition-colors shrink-0 cursor-pointer p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center ${attachOpen ? 'text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <Paperclip className="w-5 h-5" />
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

                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder={isLoading ? "Generating response..." : "Message to zome ai..."}
                            className="flex-1 bg-transparent px-3 py-1.5 ml-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50 resize-none overflow-y-auto min-h-[44px] max-h-[200px] text-[15px] leading-relaxed no-scrollbar flex items-center"
                            rows={1}
                            style={{ height: 'auto', paddingTop: '11px' }}
                        />
                    </div>

                    <div className="flex justify-end mt-2 pr-1 pb-1">
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all text-[15px] shadow-sm ${isLoading ? 'bg-[#5b45f4]/60 cursor-not-allowed text-white' : 'bg-[#5b45f4] hover:bg-[#4935d9] text-white cursor-pointer hover:shadow-md active:scale-95'}`}
                        >
                            Send <Send className="w-4 h-4 ml-0.5" />
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
