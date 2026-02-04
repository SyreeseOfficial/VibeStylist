import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Trash2, Droplets, Sparkles, Pencil, Check, X, Search, Filter, ArrowUpDown } from 'lucide-react';

const InventoryGrid = () => {
    const { inventory, setInventory, updateItem } = useVibe();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', category: '', price: '' });

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

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
        setEditForm({ name: item.name, category: item.category, price: item.price || '' });
    };

    const handleSave = (id) => {
        updateItem(id, editForm);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    // Derived State: Filtered & Sorted Inventory
    const filteredInventory = inventory
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'mostWorn') return (b.wearCount || 0) - (a.wearCount || 0);
            if (sortBy === 'leastWorn') return (a.wearCount || 0) - (b.wearCount || 0);
            // Default newest (assuming higher index/ID or recent addition logic, but here relying on array order reversal for newest)
            // Ideally we'd have a createdAt, but we'll assume array order implies time.
            return -1; // Keep array order (LIFO-ish if we map normally, but for "newest" we usually want reverse)
        });

    // Note: Array.reverse() mutates, so better to just map in reverse or assume default is oldest->newest and we want newest->oldest?
    // Let's assume the array is append-only, so last is newest.
    // Actually, typical .sort usage:
    // If Newest: we want index N to 0.
    // Let's refine sort:
    // If 'newest': return 0 (rely on reverse map or just keep current order if prepended)
    // Actually, standard VibeContext likely appends. So newest is last.
    // Let's adhere to array mutation avoidance.
    const sortedFinal = [...filteredInventory];
    if (sortBy === 'newest') {
        sortedFinal.reverse();
    }
    // If other sorts are active, they handled it.

    if (inventory.length === 0) {
        return (
            <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-500">No items yet. Add something to your wardrobe!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {/* Category Filter */}
                    <div className="relative min-w-[120px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="Top">Tops</option>
                            <option value="Bottom">Bottoms</option>
                            <option value="Shoes">Shoes</option>
                            <option value="Accessory">Accessories</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="relative min-w-[130px]">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="newest">Newest</option>
                            <option value="mostWorn">Most Worn</option>
                            <option value="leastWorn">Least Worn</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedFinal.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <p>No items match your filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                            className="mt-2 text-blue-400 hover:underline text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    sortedFinal.map((item) => (
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
                                    <div className="flex gap-2">
                                        <select
                                            value={editForm.category}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-1/2 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="Top">Top</option>
                                            <option value="Bottom">Bottom</option>
                                            <option value="Shoes">Shoes</option>
                                            <option value="Accessory">Accessory</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                            placeholder="Price $"
                                            className="w-1/2 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
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

                                    {/* Cost Per Wear */}
                                    {item.price > 0 && (
                                        <div className="mt-2 text-xs font-mono-system">
                                            {(() => {
                                                const wears = item.wearCount || 0;
                                                const cpw = item.price / (wears === 0 ? 1 : wears); // Avoid /0, assume 1 wear effectively for first calc, or just show full price if 0 wears usually.
                                                // Actually if 0 wears, you paid full price for 0 utility. 
                                                // Let's stick to simple: if 0 wears, use 1 to show price, or just display price.
                                                // Prompt said: "display 'Cost Per Wear' (Price / Wear Count)"
                                                const displayCpw = wears === 0 ? parseFloat(item.price) : cpw;

                                                let cpwColor = 'text-slate-400';
                                                if (displayCpw < 1) cpwColor = 'text-green-400';
                                                if (displayCpw > 10) cpwColor = 'text-red-400';

                                                return (
                                                    <span className={cpwColor}>
                                                        ${displayCpw.toFixed(2)} / wear
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    )}

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
                    ))
                )}
            </div>
        </div>
    );
};

export default InventoryGrid;
