import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Trash2, Droplets, Sparkles, Pencil, Check, X, Search, Filter, ArrowUpDown } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import InventoryItemCard from './InventoryItemCard';
import { calculateCPW } from '../utils/mathUtils';

const InventoryGrid = ({ isSelectionMode, selectedItems, setSelectedItems }) => {
    const { inventory, setInventory, updateItem } = useVibe();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', category: '', price: '' });
    const [deleteCandidateId, setDeleteCandidateId] = useState(null);

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
        setDeleteCandidateId(id);
    };

    const confirmDelete = () => {
        if (deleteCandidateId) {
            setInventory(prev => prev.filter(item => item.id !== deleteCandidateId));
            setDeleteCandidateId(null);
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

    const handleItemClick = (id) => {
        if (!isSelectionMode) return;

        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
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

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 items-center">
                    {/* Simplified toolbar without Log Outfit buttons since they are now in the header */}

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
                        <InventoryItemCard
                            key={item.id}
                            item={item}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedItems.includes(item.id)}
                            isEditing={editingId === item.id}
                            editForm={editForm}
                            onEditFormChange={setEditForm}
                            onItemClick={handleItemClick}
                            onEditClick={handleEditClick}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDelete={handleDelete}
                            onToggleClean={toggleClean}
                        />
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={!!deleteCandidateId}
                title="Delete Item"
                message="Are you sure you want to delete this item from your inventory? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteCandidateId(null)}
                confirmText="Delete"
                isDanger={true}
            />
        </div >
    );
};

export default InventoryGrid;

