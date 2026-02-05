import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, X } from 'lucide-react';

const LevelUpModal = ({ level, inventoryCount, onClaim, onClose }) => {
    // Determine rewards
    const xpReward = Math.max(inventoryCount * 10, 50); // Minimum 50 XP to avoid disappointment if inventory is empty

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // High zIndex for modal

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-gray-900 border border-purple-500/50 rounded-2xl shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="relative flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 mb-2">
                        <Trophy size={40} className="text-white fill-current" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500">
                            Level Up!
                        </h2>
                        <p className="text-xl text-white font-medium">
                            Level {level} Stylist Reached
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-800/50 rounded-xl p-4 w-full border border-gray-700/50">
                        <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
                            <Sparkles size={16} />
                            <span className="text-sm font-semibold uppercase tracking-wider">Bonus Rewards</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Your wardrobe is growing! You get more XP based on the number of items you've cataloged.
                        </p>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Wardrobe Items</span>
                                <span className="font-mono text-white">{inventoryCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Reward Multiplier</span>
                                <span className="font-mono text-white">x10 XP</span>
                            </div>
                            <div className="h-px bg-gray-700 my-1" />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span className="text-green-400">Total Bonus</span>
                                <span className="text-green-400">+{xpReward} XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={() => onClaim(xpReward)}
                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transform transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Sparkles size={20} />
                        Claim Rewards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;
