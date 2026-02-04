import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Trash2, Droplets, Sparkles, Pencil, Check, X } from 'lucide-react';

const InventoryGrid = () => {
    const { inventory, setInventory, updateItem } = useVibe();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', category: '' });

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

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ name: item.name, category: item.category });
    };

    const handleSave = (id) => {
        updateItem(id, editForm);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
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
                    className={`bg-gray-800 p-4 rounded-xl border flex justify-between items-start transition-all duration-300 relative group overflow-hidden ${!item.isClean ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'
                        } ${item.wearCount >= 50
                            ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                            : 'border-gray-700'
                        }`}
                >
                    {editingId === item.id ? (
                        <div className="flex-1 space-y-2 mr-2">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder="Item Name"
                                autoFocus
                            />
                            <select
                                value={editForm.category}
                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="Top">Top</option>
                                <option value="Bottom">Bottom</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Accessory">Accessory</option>
                            </select>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleSave(item.id)}
                                    className="bg-green-600/20 text-green-400 p-1.5 rounded hover:bg-green-600/30 transition"
                                    title="Save"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-600/20 text-red-400 p-1.5 rounded hover:bg-red-600/30 transition"
                                    title="Cancel"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-medium text-white">{item.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                    {item.category}
                                </span>
                                {/* Wear Count Badges */}
                                {(!item.wearCount || item.wearCount < 5) && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400 font-mono-system">New</span>
                                )}
                                {item.wearCount >= 20 && item.wearCount < 50 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-400 font-mono-system">Broken In</span>
                                )}
                                {item.wearCount >= 50 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-yellow-500 text-yellow-400 font-medium font-mono-system shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse">Legendary</span>
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
                    )}

                    {!editingId && (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                                title="Edit Item"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                title="Delete Item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default InventoryGrid;
