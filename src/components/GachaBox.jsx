import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Sparkles, HelpCircle, Package } from 'lucide-react';

const GachaBox = () => {
    const { inventory } = useVibe();
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayResult, setDisplayResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

    const handleSpin = () => {
        setErrorMsg(null);

        // Filter valid items
        const cleanItems = inventory.filter(i => i.isClean);
        const tops = cleanItems.filter(i => i.category === 'Top');
        const bottoms = cleanItems.filter(i => i.category === 'Bottom');
        const shoes = cleanItems.filter(i => i.category === 'Shoes');

        if (!tops.length || !bottoms.length || !shoes.length) {
            let missing = [];
            if (!tops.length) missing.push("tops");
            if (!bottoms.length) missing.push("bottoms");
            if (!shoes.length) missing.push("shoes");
            setErrorMsg(`Laundry Day! No clean ${missing.join(", ")} available.`);
            return;
        }

        setIsSpinning(true);

        // Animation Config
        const totalDuration = 1500; // 1.5 seconds total
        const intervalSpeed = 50;   // Update every 50ms
        const startTime = Date.now();

        const spinInterval = setInterval(() => {
            const timePassed = Date.now() - startTime;

            // Generate random temporary result
            setDisplayResult({
                top: getRandomItem(tops),
                bottom: getRandomItem(bottoms),
                shoes: getRandomItem(shoes)
            });

            // Stop condition
            if (timePassed >= totalDuration) {
                clearInterval(spinInterval);

                // Final selection
                const finalResult = {
                    top: getRandomItem(tops),
                    bottom: getRandomItem(bottoms),
                    shoes: getRandomItem(shoes)
                };

                setDisplayResult(finalResult);
                setIsSpinning(false);
            }
        }, intervalSpeed);
    };

    const ResultCard = ({ title, item }) => {
        const isLegendary = (item?.wearCount || 0) > 5;

        return (
            <div className={`p-3 rounded-lg border transition-all duration-300 ${isLegendary
                    ? 'bg-yellow-900/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                    : 'bg-gray-900/50 border-gray-700/50'
                }`}>
                <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{title}</div>
                    {isLegendary && (
                        <div className="flex items-center gap-1">
                            <Sparkles size={10} className="text-yellow-400" />
                            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Legendary</span>
                        </div>
                    )}
                </div>
                <div className={`font-medium truncate ${isLegendary ? 'text-yellow-100' : 'text-white'}`}>
                    {item?.name || '...'}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg relative overflow-hidden">
            <h3 className="text-gray-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <Package size={16} className="text-purple-500" />
                Quick Drop
            </h3>

            <div className={`transition-all duration-300`}>
                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex flex-col items-center gap-2 group"
                >
                    <HelpCircle size={24} className={`transition-transform ${isSpinning ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                    <span>{isSpinning ? 'Mixing...' : "I don't know what to wear"}</span>
                </button>
            </div>

            {/* Result Display */}
            {(displayResult || isSpinning) && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    {!isSpinning && (
                        <div className="text-center mb-2">
                            <span className="text-xs text-green-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                                <Sparkles size={12} /> Today's Drop <Sparkles size={12} />
                            </span>
                        </div>
                    )}

                    <ResultCard title="Top" item={displayResult?.top} />
                    <ResultCard title="Bottom" item={displayResult?.bottom} />
                    <ResultCard title="Shoes" item={displayResult?.shoes} />
                </div>
            )}

            {!displayResult && !isSpinning && !errorMsg && (
                <p className="text-xs text-slate-500 text-center mt-3 italic">
                    Feeling lucky? Let fate decide your fit.
                </p>
            )}

            {errorMsg && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
                </div>
            )}
        </div>
    );
};

export default GachaBox;
