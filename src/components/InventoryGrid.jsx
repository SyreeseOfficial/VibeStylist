import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Trash2, Droplets, Sparkles } from 'lucide-react';

const InventoryGrid = () => {
    const { inventory, setInventory } = useVibe();

    const toggleClean = (id) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, isClean: !item.isClean } : item
        ));
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setInventory(prev => prev.filter(item => item.id !== id));
        }
    };

    if (inventory.length === 0) {
        return (
            <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-500">No items yet. Add something to your wardrobe!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.map((item) => (
                <div
                    key={item.id}
                    className={`bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-start transition-all duration-300 ${!item.isClean ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}
                >
                    <div>
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                {item.category}
                            </span>
                            {/* Wear Count Badges */}
                            {(!item.wearCount || item.wearCount < 5) && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400">New</span>
                            )}
                            {item.wearCount >= 20 && item.wearCount < 50 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-400">Broken In</span>
                            )}
                            {item.wearCount >= 50 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/30 text-yellow-400 font-medium">Legendary</span>
                            )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <button
                                onClick={() => toggleClean(item.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${item.isClean
                                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                    : 'bg-yellow-900/30 text-yellow-500 hover:bg-yellow-900/50'
                                    }`}
                            >
                                {item.isClean ? (
                                    <><Sparkles size={12} /> Clean</>
                                ) : (
                                    <><Droplets size={12} /> Dirty</>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default InventoryGrid;
