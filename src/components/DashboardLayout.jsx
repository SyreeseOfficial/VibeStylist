import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Link } from 'react-router-dom';
import { Home, Settings, Shirt, User } from 'lucide-react';

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
                    <Link to="/onboarding" className="flex items-center gap-3 px-2 hover:bg-gray-800 rounded-xl py-2 transition cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-200">{userProfile?.name || 'User Profile'}</p>
                            <p className="text-xs text-gray-500">Free Plan</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Stage (50%) */}
            <main className="w-[50%] flex flex-col relative bg-gray-900/50">
                <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
                    <p>Chat Interface Placeholder</p>
                </div>
            </main>

            {/* Context Panel (30%) */}
            <aside className="w-[30%] border-l border-gray-800 p-6 bg-gray-900/30">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">Context</h2>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Current Vibe</h3>
                        <p className="text-gray-200">Casual Chic</p>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default DashboardLayout;
