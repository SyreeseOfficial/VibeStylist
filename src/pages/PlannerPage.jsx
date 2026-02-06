import React, { useState, useEffect } from 'react';
import { useVibe } from '../context/VibeContext';
import useWeather from '../hooks/useWeather';
import InventoryGrid from '../components/InventoryGrid';
import InventoryItemCard from '../components/InventoryItemCard';
import { Sparkles, Loader, Calendar, Plus, Trash2 } from 'lucide-react';
// import { generateStyleAdvice } from '../utils/aiService'; 

const PlannerPage = () => {
    // Debug logging
    console.log("Rendering PlannerPage");

    const weatherHook = useWeather();
    const { weather, loading: weatherLoading } = weatherHook || {};

    const vibeHook = useVibe();
    const { inventory = [], tomorrowOutfit = [], setTomorrowOutfit, userProfile } = vibeHook || {};

    const [selectedForPlan, setSelectedForPlan] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [headerImage, setHeaderImage] = useState(null);

    // Safety check for context
    if (!vibeHook) {
        return <div className="py-20 text-center text-red-400">Error: VibeContext unavailable.</div>;
    }

    const pinnedItems = inventory.filter(item => tomorrowOutfit.includes(item.id));
    const cleanInventory = inventory.filter(i => i.isClean);

    const handlePinSelected = () => {
        const newItems = selectedForPlan.filter(id => !tomorrowOutfit.includes(id));
        if (setTomorrowOutfit) {
            setTomorrowOutfit(prev => [...prev, ...newItems]);
            setSelectedForPlan([]);
        }
    };

    const handleRemoveFromPlan = (id) => {
        if (setTomorrowOutfit) {
            setTomorrowOutfit(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const handleAiPlan = async () => {
        if (!weather?.forecast?.tomorrow) return;

        setIsGenerating(true);
        try {
            const tops = cleanInventory.filter(i => i.category === 'Top');
            const bottoms = cleanInventory.filter(i => i.category === 'Bottom');
            const shoes = cleanInventory.filter(i => i.category === 'Shoes');

            const randomTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null;
            const randomBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;
            const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;

            const newIds = [randomTop?.id, randomBottom?.id, randomShoes?.id].filter(Boolean);

            if (setTomorrowOutfit) {
                setTomorrowOutfit(newIds);
            }
        } catch (error) {
            console.error("AI Planning failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 fade-in p-4 md:p-8">
            {/* Header / Weather */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Calendar className="text-purple-300" />
                            Plan for Tomorrow
                        </h1>
                        <p className="text-indigo-200">Prepare your fit in advance and earn XP!</p>
                    </div>

                    {/* Weather Card */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 min-w-[200px] text-center">
                        {weatherLoading ? (
                            <div className="flex justify-center py-2"><Loader className="animate-spin" /></div>
                        ) : weather?.forecast?.tomorrow ? (
                            <>
                                <div className="text-sm text-indigo-200 uppercase tracking-widest font-semibold mb-1">Tomorrow</div>
                                <div className="text-3xl font-bold">{weather.forecast.tomorrow.maxTemp}° / {weather.forecast.tomorrow.minTemp}°</div>
                                <div className="text-lg text-white/90">{weather.forecast.tomorrow.condition}</div>
                            </>
                        ) : (
                            <div className="text-gray-400">Weather unavailable</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tomorrow's Slot */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Tomorrow's Outfit</h2>
                    <button
                        onClick={handleAiPlan}
                        disabled={isGenerating || cleanInventory.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        Ask AI to Plan
                    </button>
                </div>

                {pinnedItems.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
                        <p className="mb-2">No items pinned yet.</p>
                        <p className="text-sm">Select items below and click "Pin Selected"!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pinnedItems.map(item => (
                            <div key={item.id} className="relative group">
                                <InventoryItemCard
                                    item={item}
                                    isSelectionMode={false}
                                    onEditClick={() => { }}
                                    onDelete={() => { }}
                                    onItemClick={() => { }}
                                />
                                <button
                                    onClick={() => handleRemoveFromPlan(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                                    title="Remove from Plan"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selection Grid */}
            <div className="space-y-6 pt-10 border-t border-gray-800/50">
                <div className="flex justify-between items-center sticky top-0 md:static z-20 bg-gray-900/95 backdrop-blur py-4">
                    <h2 className="text-xl font-semibold text-white">Wardrobe</h2>
                    {selectedForPlan.length > 0 && (
                        <button
                            onClick={handlePinSelected}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition animate-in fade-in slide-in-from-bottom-2"
                        >
                            <Plus size={18} />
                            Pin {selectedForPlan.length} Item{selectedForPlan.length !== 1 && 's'}
                        </button>
                    )}
                </div>

                <InventoryGrid
                    isSelectionMode={true}
                    selectedItems={selectedForPlan}
                    setSelectedItems={setSelectedForPlan}
                />
            </div>
        </div>
    );
};

export default PlannerPage;
