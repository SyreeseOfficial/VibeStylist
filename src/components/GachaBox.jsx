import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Sparkles, HelpCircle, Package } from 'lucide-react';

const GachaBox = () => {
    const { inventory } = useVibe();
    const [isShaking, setIsShaking] = useState(false);
    const [result, setResult] = useState(null);

    const handleSpin = () => {
        setIsShaking(true);
        setResult(null);

        setTimeout(() => {
            const cleanItems = inventory.filter(i => i.isClean);

            const tops = cleanItems.filter(i => i.category === 'Top');
            const bottoms = cleanItems.filter(i => i.category === 'Bottom');
            const shoes = cleanItems.filter(i => i.category === 'Shoes');

            if (tops.length && bottoms.length && shoes.length) {
                const randomTop = tops[Math.floor(Math.random() * tops.length)];
                const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
                const randomShoe = shoes[Math.floor(Math.random() * shoes.length)];

                setResult({ top: randomTop, bottom: randomBottom, shoes: randomShoe });
            }

            setIsShaking(false);
        }, 800);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg relative overflow-hidden">
            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                    animation-iteration-count: infinite;
                }
            `}</style>

            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <Package size={16} className="text-purple-500" />
                Quick Drop
            </h3>

            <div className={`transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}>
                <button
                    onClick={handleSpin}
                    disabled={isShaking}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex flex-col items-center gap-2 group"
                >
                    <HelpCircle size={24} className="group-hover:rotate-12 transition-transform" />
                    <span>I don't know what to wear</span>
                </button>
            </div>

            {/* Result Display */}
            {result && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="text-center mb-2">
                        <span className="text-xs text-green-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                            <Sparkles size={12} /> Today's Drop <Sparkles size={12} />
                        </span>
                    </div>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Top</div>
                        <div className="font-medium text-white truncate">{result.top.name}</div>
                    </div>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Bottom</div>
                        <div className="font-medium text-white truncate">{result.bottom.name}</div>
                    </div>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Shoes</div>
                        <div className="font-medium text-white truncate">{result.shoes.name}</div>
                    </div>
                </div>
            )}

            {!result && !isShaking && (
                <p className="text-xs text-gray-500 text-center mt-3 italic">
                    Feeling lucky? Let fate decide your fit.
                </p>
            )}
        </div>
    );
};

export default GachaBox;
