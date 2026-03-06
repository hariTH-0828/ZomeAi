import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Volume2,
    Copy,
    RotateCcw,
    ThumbsDown,
    Settings2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import UserAvatar from '../common/UserAvatar';

const MessageList = ({ messages = [], isLoading, user }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar scroll-smooth transition-colors">
            <div className="max-w-4xl mx-auto space-y-8">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-4"
                    >
                        {msg.role === 'user' ? (
                            <>
                                <UserAvatar user={user} size="md" className="ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.displayName || 'You'}</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">now</span>
                                    </div>
                                    <div className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 px-5 py-3.5 rounded-2xl rounded-tl-sm w-fit max-w-[85%] text-[15px] leading-relaxed shadow-sm border border-slate-100 dark:border-slate-700/50">
                                        {msg.content}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-[#E8E6FC] dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                    <Settings2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">AI</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">now</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#1a1c23] text-slate-700 dark:text-slate-300 p-6 rounded-2xl rounded-tl-sm w-full max-w-4xl text-[15px] leading-relaxed shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-x-auto">
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
                                                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
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
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 ml-1 mt-3">
                                        <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Volume2 className="w-4 h-4" /></button>
                                        <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Copy className="w-4 h-4" /></button>
                                        <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><RotateCcw className="w-4 h-4" /></button>
                                        <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><ThumbsDown className="w-4 h-4" /></button>
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
                        <div className="w-10 h-10 rounded-full bg-[#E8E6FC] dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Settings2 className="w-5 h-5 animate-spin" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">AI</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#1a1c23] text-slate-700 dark:text-slate-300 p-6 rounded-2xl rounded-tl-sm w-24 text-[15px] shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex space-x-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="h-4"></div>
            </div>
        </div>
    );
};

export default MessageList;
