import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Plus, Check, Camera, X } from 'lucide-react';
import { resizeImage } from '../utils/imageUtils';

const AddItemForm = ({ mode = 'inventory' }) => {
    const { setInventory, addToWishlist } = useVibe();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Top',
        price: '',
        isClean: true
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resized = await resizeImage(file);
                setImagePreview(resized);
            } catch (err) {
                console.error("Error resizing image", err);
            }
        }
    };

    const clearImage = () => {
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now().toString(),
            ...formData,
            image: imagePreview,
            wearCount: 0,
            dateAdded: new Date().toISOString()
        };

        if (mode === 'wishlist') {
            // Wishlist items might not need isClean or wearCount initially, but keeping structure is fine.
            addToWishlist(newItem);
        } else {
            setInventory(prev => [...prev, newItem]);
        }

        // Reset form and show success
        setFormData({ name: '', category: 'Top', price: '', isClean: true });
        setImagePreview(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Plus size={20} className={mode === 'wishlist' ? "text-purple-500" : "text-blue-500"} />
                {mode === 'wishlist' ? 'Add to Wishlist' : 'Add New Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="flex justify-center mb-6">
                    <div className="relative group">
                        <div
                            onClick={() => document.getElementById('item-image-upload').click()}
                            className={`w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition overflow-hidden ${imagePreview ? 'border-blue-500 bg-gray-900' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                                }`}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <Camera className="mx-auto text-gray-400 mb-2" size={24} />
                                    <span className="text-xs text-gray-400">Add Photo</span>
                                </div>
                            )}
                        </div>

                        {imagePreview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <input
                            id="item-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Item Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Item Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={mode === 'wishlist' ? "e.g. Dream Jacket" : "e.g. Navy Blue Blazer"}
                        required
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        {mode === 'wishlist' ? 'Estimated Price ($)' : 'Purchase Price ($)'}
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
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

                {/* Clean/Dirty - Hide in Wishlist Mode */}
                {mode !== 'wishlist' && (
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
                )}

                <button
                    type="submit"
                    className={`w-full text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 mt-4 ${mode === 'wishlist' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                >
                    {showSuccess ? (
                        <>
                            <Check size={18} /> Added!
                        </>
                    ) : (
                        mode === 'wishlist' ? 'Add to Wishlist' : 'Add to Wardrobe'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddItemForm;
