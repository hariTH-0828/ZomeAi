import React from 'react';
import { Home, User, Settings } from 'lucide-react';

const LeftNav = () => {
    return (
        <div className="group w-16 hover:w-56 h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col py-4 flex-shrink-0 transition-all duration-300 overflow-hidden relative z-50">
            {/* Top Logo */}
            <div className="flex items-center w-full px-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#5C45FD] text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                    Z
                </div>
                <span className="ml-3 font-bold text-lg text-slate-800 dark:text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ZOMI Ai
                </span>
            </div>

            {/* Nav Actions */}
            <div className="flex flex-col gap-2 w-full px-2 flex-1">
                <button className="flex items-center p-2 text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-800 rounded-xl transition-colors w-full group/btn">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Home</span>
                </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 w-full px-2 mt-auto">
                <button className="flex items-center p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors w-full group/btn">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <Settings className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Settings</span>
                </button>
                <button className="flex items-center p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors w-full group/btn mt-2">
                    <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="User profile"
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-transparent group-hover/btn:ring-slate-300 dark:group-hover/btn:ring-slate-700 transition-all"
                    />
                    <span className="ml-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default LeftNav;
