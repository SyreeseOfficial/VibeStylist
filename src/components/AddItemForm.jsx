import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Plus, Check } from 'lucide-react';

const AddItemForm = () => {
    const { setInventory } = useVibe();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Top',
        isClean: true
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now().toString(),
            ...formData,
            dateAdded: new Date().toISOString()
        };

        setInventory(prev => [...prev, newItem]);

        // Reset form and show success
        setFormData({ name: '', category: 'Top', isClean: true });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-500" />
                Add New Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Item Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Item Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Navy Blue Blazer"
                        required
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                    >
                        <option value="Top">Top</option>
                        <option value="Bottom">Bottom</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Accessory">Accessory</option>
                    </select>
                </div>

                {/* Clean/Dirty */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isClean"
                        checked={formData.isClean}
                        onChange={(e) => setFormData({ ...formData, isClean: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isClean" className="text-sm text-gray-300">Item is Clean</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 mt-4"
                >
                    {showSuccess ? (
                        <>
                            <Check size={18} /> Added!
                        </>
                    ) : (
                        'Add to Wardrobe'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddItemForm;
