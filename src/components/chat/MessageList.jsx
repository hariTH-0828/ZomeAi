import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Volume2,
    Copy,
    RotateCcw,
    ThumbsDown,
    Settings2,
    Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import UserAvatar from '../common/UserAvatar';

const MessageList = ({ messages = [], isLoading, user, activeChat, onEditSubmit, onReloadSubmit }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [showToast, setShowToast] = useState(false);

    const startEdit = (index, content) => {
        setEditingIndex(index);
        setEditContent(content);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditContent('');
    };

    const saveEdit = (index) => {
        if (editContent.trim() && onEditSubmit) {
            onEditSubmit(index, editContent);
        }
        setEditingIndex(null);
    };

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="flex-1 overflow-y-auto w-full no-scrollbar relative">
            <div className="max-w-4xl mx-auto w-full pb-32">
                {/* Sticky Glassy Chat Title */}
                {activeChat?.title && (
                    <div className="flex justify-center w-full mt-3 mb-8">
                        <div className="px-6 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-300">
                            {activeChat.title}
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.role === 'user' ? (
                            <>
                                {editingIndex === index ? (
                                    <div className="flex-1 flex flex-col items-end w-full">
                                        <div className="bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-700 w-full max-w-[85%] rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-transparent text-slate-800 dark:text-slate-200 text-[15px] outline-none resize-none leading-relaxed"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button onClick={cancelEdit} className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">Cancel</button>
                                                <button onClick={() => saveEdit(index)} className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition cursor-pointer shadow-sm">Save & Resend</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-end group">
                                        <div className="bg-indigo-600 text-white px-5 py-4 rounded-3xl w-fit max-w-[85%] text-[15px] leading-relaxed shadow-sm">
                                            {msg.content}
                                            <div className="text-[11px] text-indigo-200/80 text-right mt-1.5 flex items-center justify-end gap-1 select-none">
                                                10:25
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L7 17l-5-5"></path><path d="M22 10l-7.5 7.5L13 16"></path></svg>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 mt-2 mr-2 text-slate-400 dark:text-slate-500">
                                            <button onClick={() => handleCopy(msg.content)} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Copy className="w-4 h-4" /></button>
                                            <button onClick={() => startEdit(index, msg.content)} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Edit2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                )}
                                <UserAvatar user={user} size="md" className="shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm mt-1" />
                            </>
                        ) : (
                            <>
                                <div className="flex-1 overflow-hidden group">
                                    <div className="bg-white dark:bg-[#0f1117] text-slate-700 dark:text-slate-300 px-6 py-5 rounded-3xl w-full max-w-4xl text-[15px] leading-relaxed shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <div className="rounded-xl overflow-hidden my-4 border border-slate-200 dark:border-slate-700/50 shadow-sm bg-[#282c34]">
                                                            <div className="bg-slate-200 dark:bg-slate-800/80 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between border-b border-slate-300 dark:border-slate-700/50">
                                                                <span>{match[1]}</span>
                                                                <button
                                                                    onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                                                                    className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <Copy className="w-3.5 h-3.5" /> Copy
                                                                </button>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                children={String(children).replace(/\n$/, '')}
                                                                style={oneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <code {...props} className={`${className || ''} bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-indigo-600 dark:text-indigo-400`}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-slate-400">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-slate-400">{children}</ol>,
                                                li: ({ children }) => <li className="pl-1">{children}</li>,
                                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-slate-800 dark:text-slate-100">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-xl font-semibold mb-4 mt-6 text-slate-800 dark:text-slate-100">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-lg font-medium mb-3 mt-5 text-slate-800 dark:text-slate-100">{children}</h3>,
                                                a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{children}</a>,
                                                blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-300 dark:border-indigo-600 pl-4 py-1 my-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-r-lg italic text-slate-600 dark:text-slate-400">{children}</blockquote>,
                                                table: ({ children }) => <div className="overflow-x-auto mb-4 border border-slate-200 dark:border-slate-700/50 rounded-lg"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">{children}</table></div>,
                                                th: ({ children }) => <th className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{children}</th>,
                                                td: ({ children }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">{children}</td>,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                        <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right mt-3 flex items-center justify-end gap-1 select-none">
                                            10:25
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L7 17l-5-5"></path><path d="M22 10l-7.5 7.5L13 16"></path></svg>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-slate-400 dark:text-slate-500 ml-2 mt-2">
                                        <button onClick={() => handleCopy(msg.content)} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Copy className="w-4 h-4" /></button>
                                        <button onClick={() => onReloadSubmit && onReloadSubmit(index)} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><RotateCcw className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="flex-1">
                            <div className="bg-white dark:bg-[#0f1117] p-6 rounded-3xl w-fit text-[15px] shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="h-4"></div>
            </div>

            {/* Copied Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -10, x: "-50%" }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-800 px-5 py-2.5 rounded-full text-sm font-medium shadow-xl z-[100] flex items-center gap-2 pointer-events-none"
                    >
                        <svg className="w-4 h-4 text-green-400 dark:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        Copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageList;
