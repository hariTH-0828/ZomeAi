import React, { useState } from 'react';
import { SquarePen, ChevronDown, Edit2, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ historyItems, setHistoryItems, activeChat, setActiveChat, handleCreateNewChat }) => {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const handleCreate = () => {
        handleCreateNewChat();
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setHistoryItems(historyItems.filter(item => item.id !== id));
        if (activeChat?.id === id) setActiveChat(null);
    };

    const startEdit = (item, e) => {
        e.stopPropagation();
        setEditingId(item.id);
        setEditTitle(item.title);
    };

    const saveEdit = (e) => {
        e?.stopPropagation();
        if (editTitle.trim()) {
            setHistoryItems(historyItems.map(item =>
                item.id === editingId ? { ...item, title: editTitle } : item
            ));
        }
        setEditingId(null);
    };

    const cancelEdit = (e) => {
        e.stopPropagation();
        setEditingId(null);
    };

    return (
        <div className="w-72 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 transition-colors z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xl select-none">
                    <div className="w-6 h-6 bg-indigo-600 rounded-sm flex items-center justify-center mask mask-squircle text-white text-sm">
                        ✦
                    </div>
                    ZOME Ai
                </div>
                <button
                    onClick={handleCreate}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <SquarePen className="w-5 h-5" />
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
                {/* Today Section */}
                <div className="flex flex-col gap-1 mb-6">
                    <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg">
                        <span>Today</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                            {historyItems.length} Total
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {historyItems.length === 0 ? (
                            <div className="text-center py-6 px-4 text-sm text-slate-500 dark:text-slate-400">
                                No chat are available
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {historyItems.map((item) => {
                                    const isActive = activeChat?.id === item.id;
                                    const isEditing = editingId === item.id;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <button
                                                onClick={() => setActiveChat(item)}
                                                className={`group w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors border-l-2 relative overflow-hidden ${isActive
                                                    ? 'border-indigo-600 bg-slate-200/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium'
                                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                                                        <input
                                                            autoFocus
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(e)}
                                                            className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-800 dark:text-slate-200"
                                                        />
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"><Check className="w-3.5 h-3.5" /></button>
                                                            <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><X className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="truncate pr-12 text-left w-full">{item.title}</span>

                                                        {/* Hover Actions */}
                                                        <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gradient-to-l from-slate-200/90 dark:from-slate-800/90 to-transparent pl-4 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                            <button
                                                                onClick={(e) => startEdit(item, e)}
                                                                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete(item.id, e)}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
