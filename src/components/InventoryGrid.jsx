import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Trash2, Droplets, Sparkles, Pencil, Check, X, Search, Filter, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import InventoryItemCard from './InventoryItemCard';
import { calculateCPW } from '../utils/mathUtils';

const InventoryGrid = ({ isSelectionMode, selectedItems, setSelectedItems, mode = 'inventory' }) => {
    const { inventory, setInventory, updateItem, wishlist, removeFromWishlist, buyItem, setWishlist } = useVibe();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', category: '', price: '' });
    const [deleteCandidateId, setDeleteCandidateId] = useState(null);

    // Determine which data to use
    const itemsToDisplay = mode === 'wishlist' ? wishlist : inventory;

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
            if (mode === 'wishlist') {
                removeFromWishlist(deleteCandidateId);
            } else {
                setInventory(prev => prev.filter(item => item.id !== deleteCandidateId));
            }
            setDeleteCandidateId(null);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ name: item.name, category: item.category, price: item.price || '' });
    };

    const handleSave = (id) => {
        if (mode === 'wishlist') {
            setWishlist(prev => prev.map(item =>
                item.id === id ? { ...item, ...editForm } : item
            ));
        } else {
            updateItem(id, editForm);
        }
        setEditingId(null);
    };

    // Patching handleSave to support wishlist locally inside this component requires setWishlist
    // I will use a separate effect or just grab setWishlist above if I can re-declare. 
    // Actually, I can just re-write the destructuring line.

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleItemClick = (id) => {
        if (!isSelectionMode) return;

        // Wishlist usually doesn't need selection for "log outfit", but maybe for bulk delete?
        // User didn't specify wishlist selection features, but good to keep safe.

        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleBuy = (item) => {
        buyItem(item);
    }

    // Derived State: Filtered & Sorted Inventory
    const filteredInventory = itemsToDisplay
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                // Assuming dateAdded is ISO string. 
                return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
            }
            if (sortBy === 'mostWorn') return (b.wearCount || 0) - (a.wearCount || 0);
            if (sortBy === 'leastWorn') return (a.wearCount || 0) - (b.wearCount || 0);

            if (sortBy === 'bestValue') {
                // Lowest CPW
                const cpwA = calculateCPW(a.price, a.wearCount || 0).value;
                const cpwB = calculateCPW(b.price, b.wearCount || 0).value;
                // If price is 0, CPW is 0. 
                // We typically want "Best Value" to mean "I got my money's worth" -> Low Cost Per Wear.
                // If I prefer "Low Price" for unworn items, checking CPW handles it (price/1 if 0 wears).
                return cpwA - cpwB;
            }
            if (sortBy === 'worstValue') {
                // Highest CPW
                const cpwA = calculateCPW(a.price, a.wearCount || 0).value;
                const cpwB = calculateCPW(b.price, b.wearCount || 0).value;
                return cpwB - cpwA;
            }

            if (sortBy === 'neglected') {
                // Oldest date added with lowest wears.
                // Score = WearCount + (recency_factor).
                // Or sort by WearCount ASC, then Date ASC.
                if ((a.wearCount || 0) !== (b.wearCount || 0)) {
                    return (a.wearCount || 0) - (b.wearCount || 0);
                }
                return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
            }

            return 0;
        });

    if (itemsToDisplay.length === 0) {
        return (
            <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-500">
                    {mode === 'wishlist' ? "Your wishlist is empty." : "No items yet. Add something to your wardrobe!"}
                </p>
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
                            {[
                                { value: 'newest', label: 'Newest' },
                                ...(mode === 'inventory' ? [
                                    { value: 'mostWorn', label: 'Most Worn' },
                                    { value: 'leastWorn', label: 'Least Worn' },
                                    { value: 'bestValue', label: 'Best Value (Low CPW)' },
                                    { value: 'worstValue', label: 'Worst Value (High CPW)' },
                                    { value: 'neglected', label: 'Neglected (Wear More!)' }
                                ] : [])
                            ].map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInventory.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 col-span-full">
                        <p>No items match your filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                            className="mt-2 text-blue-400 hover:underline text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredInventory.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <InventoryItemCard
                                    item={item}
                                    isSelectionMode={isSelectionMode}
                                    isSelected={selectedItems.includes(item.id)}
                                    // Make sure editing works if we implement it, but for now we might break it slightly if setWishlist isn't used
                                    // I'll fix the save handler below quickly to actually use setWishlist
                                    isEditing={editingId === item.id}
                                    editForm={editForm}
                                    onEditFormChange={setEditForm}
                                    onItemClick={handleItemClick}
                                    onEditClick={handleEditClick}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onDelete={handleDelete}
                                    onToggleClean={toggleClean}
                                    isWishlist={mode === 'wishlist'}
                                    onBuy={handleBuy}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!deleteCandidateId}
                title="Delete Item"
                message={`Are you sure you want to delete this item from your ${mode}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteCandidateId(null)}
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default InventoryGrid;

