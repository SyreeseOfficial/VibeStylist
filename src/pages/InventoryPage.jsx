import React from 'react';
import AddItemForm from '../components/AddItemForm';
import InventoryGrid from '../components/InventoryGrid';
import { useVibe } from '../context/VibeContext';
import { Shirt, WashingMachine, Calendar, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const InventoryPage = () => {
    const { inventory, setInventory, logOutfit } = useVibe();
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState([]);

    const handleLaundryDay = () => {
        const dirtyItems = inventory.filter(item => !item.isClean);

        if (dirtyItems.length === 0) {
            toast.info("Everything is already clean!");
            return;
        }

        setInventory(prev => prev.map(item => ({
            ...item,
            isClean: true
        })));

        toast.success(`Laundry done! ${dirtyItems.length} items are back in rotation.`);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedItems([]);
    };

    const handleConfirmLog = () => {
        if (selectedItems.length === 0) {
            toast.error("Select at least one item to log an outfit!");
            return;
        }

        logOutfit(selectedItems);

        const dirtySelected = inventory.filter(i => selectedItems.includes(i.id) && !i.isClean);
        if (dirtySelected.length > 0) {
            toast.warning(`Logged! Warning: You wore ${dirtySelected.length} dirty item(s).`);
        } else {
            toast.success(`Outfit logged successfully! +100 XP`);
        }

        setIsSelectionMode(false);
        setSelectedItems([]);
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shirt className="text-purple-500" />
                    Wardrobe Inventory
                </h1>

                <div className="flex items-center gap-3">
                    {!isSelectionMode ? (
                        <>
                            <button
                                onClick={toggleSelectionMode}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20"
                            >
                                <Calendar size={20} />
                                Log Outfit
                            </button>
                            <button
                                onClick={handleLaundryDay}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                            >
                                <WashingMachine size={20} />
                                Laundry Day
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 bg-gray-800 p-1.5 rounded-xl border border-gray-700">
                            <span className="text-xs font-medium text-gray-400 px-2">{selectedItems.length} selected</span>
                            <button
                                onClick={handleConfirmLog}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all animate-pulse"
                            >
                                <Check size={16} />
                                Confirm Log
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add Item Form */}
                <div className="lg:col-span-1">
                    <AddItemForm />

                    <div className="mt-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-900 p-3 rounded-lg">
                                <p className="text-2xl font-bold text-white">{inventory.length}</p>
                                <p className="text-xs text-gray-500">Total Items</p>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg">
                                <p className="text-2xl font-bold text-blue-500">
                                    {inventory.filter(i => i.isClean).length}
                                </p>
                                <p className="text-xs text-gray-500">Clean Items</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Inventory List */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white mb-4">Your Items</h2>
                    <InventoryGrid
                        isSelectionMode={isSelectionMode}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
