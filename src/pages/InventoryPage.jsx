import React from 'react';
import AddItemForm from '../components/AddItemForm';
import InventoryGrid from '../components/InventoryGrid';
import { useVibe } from '../context/VibeContext';
import { Shirt } from 'lucide-react';

const InventoryPage = () => {
    const { inventory } = useVibe();

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Shirt className="text-purple-500" />
                Wardrobe Inventory
            </h1>

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
