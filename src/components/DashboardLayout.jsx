import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Link, Outlet } from 'react-router-dom';
import { Home, Settings, Shirt, User } from 'lucide-react';
import ContextPanel from './ContextPanel';

const DashboardLayout = () => {
    const { userProfile } = useVibe();

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Left Sidebar (20%) */}
            <aside className="w-[20%] border-r border-gray-800 p-4 flex flex-col min-w-[200px]">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <span className="text-2xl">✨</span>
                    <h1 className="text-xl font-bold tracking-tight">VibeStylist</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition">
                        <Home size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition">
                        <Shirt size={20} />
                        <span className="font-medium">Inventory</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-800">
                    <Link to="/onboarding" className="flex items-center gap-3 px-2 hover:bg-gray-800 rounded-xl py-2 transition cursor-pointer mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                            <span className="font-bold text-white shadow-sm">{userProfile?.name ? userProfile.name[0] : 'U'}</span>
                        </div>
                        <div className="text-sm min-w-0">
                            <p className="font-medium text-gray-200 truncate">{userProfile?.name || 'User Profile'}</p>
                            <p className="text-xs text-purple-400 font-semibold font-mono-system">Level {Math.floor((userProfile?.xp || 0) / 1000) + 1} Stylist</p>
                        </div>
                    </Link>

                    {/* XP Logic using inline calculation for display */}
                    {(() => {
                        const xp = userProfile?.xp || 0;
                        const progress = (xp % 1000) / 10;
                        return (
                            <div className="px-2">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold font-mono-system">
                                    <span>XP</span>
                                    <span>{Math.floor(xp % 1000)} / 1000</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </aside>

            {/* Main Stage (50%) */}
            <main className="w-[50%] flex flex-col relative bg-gray-900/50">
                <Outlet />
            </main>

            {/* Context Panel (30%) */}
            <ContextPanel />
        </div>
    );
};

export default DashboardLayout;
