import React from 'react';
import Sidebar from './Sidebar';
import TopHeader from '../chat/TopHeader';

const MainLayout = ({ children, historyItems, setHistoryItems, activeChat, setActiveChat, handleCreateNewChat, activeModel, setActiveModel, models, user }) => {
    return (
        <div className="flex w-screen h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
            <Sidebar
                historyItems={historyItems}
                setHistoryItems={setHistoryItems}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                handleCreateNewChat={handleCreateNewChat}
                user={user}
            />
            <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f1117] shadow-[-1px_0_0_rgba(229,231,235,1)] dark:shadow-[-1px_0_0_rgba(30,41,59,1)] z-10 transition-colors relative">
                <TopHeader
                    activeChat={activeChat}
                    activeModel={activeModel}
                    setActiveModel={setActiveModel}
                    models={models}
                    user={user}
                />
                <div className="flex-1 flex flex-col min-w-0 relative z-0 overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
