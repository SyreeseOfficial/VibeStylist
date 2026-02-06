import React from 'react';
import AddItemForm from '../components/AddItemForm';
import InventoryGrid from '../components/InventoryGrid';
import { useVibe } from '../context/VibeContext';
import { Heart, Wallet } from 'lucide-react';

const WishlistPage = () => {
    const { wishlist, budget, setBudget } = useVibe();
    const [isEditingBudget, setIsEditingBudget] = React.useState(false);
    const [newBudget, setNewBudget] = React.useState(budget);
    // Wishlist doesn't strictly need selection mode for now as per requirements, 
    // but InventoryGrid supports it if we pass props. 
    // I'll keep it simple for now and not implement bulk selection for wishlist unless needed.
    // However, InventoryGrid requires these props to handle item clicks properly (or fails gracefully).
    // Let's pass dummy state or implement selection if we want bulk delete later.
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState([]);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedItems([]);
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Heart className="text-pink-500" />
                    My Wishlist
                </h1>

                <div className="flex items-center gap-4 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                        <Wallet className="text-green-400" size={20} />
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Remaining Budget</span>
                            {isEditingBudget ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-24 bg-gray-900 border border-gray-600 rounded px-2 py-0.5 text-white text-sm focus:outline-none focus:border-green-500"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            setBudget(parseFloat(newBudget));
                                            setIsEditingBudget(false);
                                        }}
                                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                                    setNewBudget(budget); // Sync before editing
                                    setIsEditingBudget(true);
                                }}>
                                    <span className={`text-lg font-bold font-mono-system ${budget < 0 ? 'text-red-400' : 'text-white'}`}>
                                        ${budget.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Top Section: Add Item Form & Stats */}
                <div className="w-full space-y-6">
                    <AddItemForm mode="wishlist" />

                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Wishlist Stats</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-900 p-3 rounded-lg flex-1">
                                <p className="text-2xl font-bold text-white">{wishlist.length}</p>
                                <p className="text-xs text-gray-500">Items Wanted</p>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg flex-1">
                                <p className="text-2xl font-bold text-pink-500">
                                    ${wishlist.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Total Value</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Wishlist Grid */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Desired Items</h2>
                        <button
                            onClick={toggleSelectionMode}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${isSelectionMode ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {isSelectionMode ? 'Cancel Selection' : 'Select Items'}
                        </button>
                    </div>

                    <InventoryGrid
                        mode="wishlist"
                        isSelectionMode={isSelectionMode}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
