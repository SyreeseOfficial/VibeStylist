import React from 'react';
import AddItemForm from '../components/AddItemForm';
import InventoryGrid from '../components/InventoryGrid';
import { useVibe } from '../context/VibeContext';
import { Shirt, WashingMachine } from 'lucide-react';
import { toast } from 'sonner';

const InventoryPage = () => {
    const { inventory, setInventory } = useVibe();

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

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shirt className="text-purple-500" />
                    Wardrobe Inventory
                </h1>

                <button
                    onClick={handleLaundryDay}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                    <WashingMachine size={20} />
                    Laundry Day
                </button>
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
                    <InventoryGrid />
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
