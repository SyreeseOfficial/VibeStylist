import React, { useState, useEffect, useRef } from 'react';
import { useVibe } from '../context/VibeContext';
import { Link, Outlet } from 'react-router-dom';
import { Home, Settings, Shirt, User, Menu, X, BarChart2 } from 'lucide-react';
import ContextPanel from './ContextPanel';
import StyleRadar from './StyleRadar';
import LevelUpModal from './LevelUpModal';

const DashboardLayout = () => {
    const { userProfile, setUserProfile, inventory } = useVibe();
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isMobileContextOpen, setIsMobileContextOpen] = useState(false);

    // Calculate current level
    const currentLevel = Math.floor((userProfile?.xp || 0) / 1000) + 1;

    // Track previous level to detect changes
    const prevLevelRef = useRef(currentLevel);

    useEffect(() => {
        if (currentLevel > prevLevelRef.current) {
            setShowLevelModal(true);
        }
        prevLevelRef.current = currentLevel;
    }, [currentLevel]);

    const handleClaimRewards = (xpReward) => {
        setUserProfile(prev => ({
            ...prev,
            xp: (prev.xp || 0) + xpReward
        }));
        setShowLevelModal(false);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Mobile Overlay */}
            {(isMobileNavOpen || isMobileContextOpen) && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => {
                        setIsMobileNavOpen(false);
                        setIsMobileContextOpen(false);
                    }}
                />
            )}

            {/* Left Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col 
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:w-[20%] md:min-w-[200px]
                ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="md:hidden absolute top-2 right-2 z-50">
                    <button onClick={() => setIsMobileNavOpen(false)} className="p-2 text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
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
                    <Link to="/logbook" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span className="font-medium">Logbook</span>
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


                    {/* Style Radar */}
                    <StyleRadar />
                </div>
            </aside>

            {/* Main Stage */}
            <main className="flex-1 flex flex-col relative bg-gray-900/50 w-full md:w-[50%] overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 shrink-0">
                    <button onClick={() => setIsMobileNavOpen(true)} className="p-2 -ml-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg tracking-tight">VibeStylist</span>
                    <button onClick={() => setIsMobileContextOpen(true)} className="p-2 -mr-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
                        <BarChart2 size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto relative">
                    <Outlet />
                </div>
            </main>

            {/* Context Panel */}
            <ContextPanel className={`
                fixed inset-y-0 right-0 z-50 w-80 bg-gray-900
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:w-[30%] md:bg-transparent
                ${isMobileContextOpen ? 'translate-x-0' : 'translate-x-full'}
            `} />

            {/* Level Up Modal */}
            {showLevelModal && (
                <LevelUpModal
                    level={currentLevel}
                    inventoryCount={inventory.length}
                    onClaim={handleClaimRewards}
                    onClose={() => setShowLevelModal(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
