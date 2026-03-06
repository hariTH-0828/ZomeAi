import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ChevronDown, Check } from 'lucide-react';

const TopHeader = ({ activeChat, activeModel, setActiveModel, models }) => {
    const [theme, setTheme] = useState('light');
    const [modelOpen, setModelOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setModelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col w-full z-10 shrink-0">
            {/* Main Header */}
            <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#0f1117] transition-colors">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setModelOpen(!modelOpen)}
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {activeModel}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {modelOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                            {models.map(model => (
                                <button
                                    key={model}
                                    onClick={() => { setActiveModel(model); setModelOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex flex-row items-center justify-between transition-colors"
                                >
                                    {model}
                                    {activeModel === model && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 shadow-inner transition-colors">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <Sun className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <Moon className="w-4 h-4" />
                        </button>
                    </div>
                    <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm object-cover"
                    />
                </div>
            </div>

            {/* Sub Header for Chat Title */}
            {activeChat && (
                <div className="h-10 flex items-center justify-center px-6 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1117] transition-colors relative">
                    <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-lg">
                        {activeChat.title}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TopHeader;
