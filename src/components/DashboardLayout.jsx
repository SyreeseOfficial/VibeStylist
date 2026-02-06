import React, { useState, useEffect, useRef } from 'react';
import { useVibe } from '../context/VibeContext';
import { Outlet } from 'react-router-dom';
import ContextPanel from './ContextPanel';
import LevelUpModal from './LevelUpModal';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

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
            <Sidebar
                isMobileNavOpen={isMobileNavOpen}
                setIsMobileNavOpen={setIsMobileNavOpen}
                userProfile={userProfile}
            />

            {/* Main Stage */}
            <main className="flex-1 flex flex-col relative bg-gray-900/50 w-full md:w-[65%] overflow-hidden">
                <MobileHeader
                    setIsMobileNavOpen={setIsMobileNavOpen}
                    setIsMobileContextOpen={setIsMobileContextOpen}
                    userProfile={userProfile}
                />

                <div className="flex-1 overflow-auto relative">
                    <Outlet />
                </div>
            </main>

            {/* Context Panel */}
            <ContextPanel className={`
                fixed inset-y-0 right-0 z-50 w-80 bg-gray-900
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:w-[20%] md:bg-transparent
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
