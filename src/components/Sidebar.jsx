import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Shirt, X, Calendar, BarChart3, Heart } from 'lucide-react';
import { STYLES } from '../utils/styles';
import { playSound, SOUNDS } from '../utils/soundEffects';

const Sidebar = ({ isMobileNavOpen, setIsMobileNavOpen, userProfile }) => {
    const location = useLocation();

    // Helper to determine active state
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const getLinkClass = (path) => isActive(path) ? STYLES.NAV.LINK_ACTIVE : STYLES.NAV.LINK_INACTIVE;
    // XP Progress Calculation
    const xp = userProfile?.xp || 0;
    const progress = (xp % 1000) / 10;
    const level = Math.floor(xp / 1000) + 1;

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col 
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:w-[15%] md:min-w-[200px]
            ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="md:hidden absolute top-2 right-2 z-50">
                <button onClick={() => setIsMobileNavOpen(false)} className="p-2 text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>
            <div className={STYLES.NAV.HEADER}>
                <span className="text-2xl">✨</span>
                <h1 className="text-xl font-bold tracking-tight">VibeStylist</h1>
            </div>

            <nav className="space-y-2 flex-1">
                <Link to="/" className={getLinkClass('/')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
                    <Home size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/planner" className={getLinkClass('/planner')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
                    <Calendar size={20} />
                    <span className="font-medium">Plan for Tomorrow</span>
                </Link>
                <Link to="/inventory" className={getLinkClass('/inventory')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
                    <Shirt size={20} />
                    <span className="font-medium">Inventory</span>
                </Link>
                <Link to="/wishlist" className={getLinkClass('/wishlist')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
                    <Heart size={20} />
                    <span className="font-medium">Wishlist</span>
                </Link>
                <Link to="/logbook" className={getLinkClass('/logbook')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
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
                <Link to="/stats" className={getLinkClass('/stats')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
                    <BarChart3 size={20} />
                    <span className="font-medium">Stats</span>
                </Link>
                <Link to="/settings" className={getLinkClass('/settings')} onClick={() => playSound(SOUNDS.CLICK, userProfile?.soundEffects)}>
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
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-purple-400 font-semibold font-mono-system">Level {level} Stylist</p>
                            {(userProfile?.streak || 0) > 0 && (
                                <span className="text-xs text-orange-400 font-bold bg-orange-400/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    🔥 {userProfile.streak}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

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
            </div>
        </aside>
    );
};

export default Sidebar;
