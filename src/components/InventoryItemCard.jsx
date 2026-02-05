import React from 'react';
import { Pencil, Trash2, Check, X, Sparkles, Droplets } from 'lucide-react';
import { calculateCPW } from '../utils/mathUtils';

const InventoryItemCard = ({
    item,
    isSelectionMode,
    isSelected,
    isEditing,
    editForm,
    onEditFormChange = () => { },
    onItemClick = () => { },
    onEditClick = () => { },
    onSave = () => { },
    onCancel = () => { },
    onDelete = () => { },
    onToggleClean = () => { }
}) => {
    return (
        <div
            onClick={() => onItemClick(item.id)}
            className={`bg-gray-800 p-4 rounded-xl border flex justify-between items-start transition-all duration-300 relative group overflow-hidden 
                ${!item.isClean ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'} 
                ${item.wearCount >= 50 && !isSelectionMode ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-gray-700'}
                ${isSelectionMode ? 'cursor-pointer hover:bg-gray-700' : ''}
                ${isSelectionMode && isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-500/10' : ''}
            `}
        >
            {isEditing ? (
                <div className="flex-1 space-y-2 mr-2">
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => onEditFormChange(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Item Name"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <select
                            value={editForm.category}
                            onChange={(e) => onEditFormChange(prev => ({ ...prev, category: e.target.value }))}
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
                            onChange={(e) => onEditFormChange(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="Price $"
                            className="w-1/2 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onSave(item.id); }}
                            className="bg-green-600/20 text-green-400 p-1.5 rounded hover:bg-green-600/30 transition"
                            title="Save"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onCancel(); }}
                            className="bg-red-600/20 text-red-400 p-1.5 rounded hover:bg-red-600/30 transition"
                            title="Cancel"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 items-start w-full">
                    {/* Selection Indicator */}
                    {isSelectionMode && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                            {isSelected && <Check size={14} className="text-white" />}
                        </div>
                    )}

                    {/* Image Thumbnail */}
                    {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 bg-gray-900">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    )}

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
                                    const { value, colorClass } = calculateCPW(item.price, item.wearCount);
                                    return (
                                        <span className={colorClass}>
                                            ${value.toFixed(2)} / wear
                                        </span>
                                    );
                                })()}
                            </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                            {!isSelectionMode && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleClean(item.id); }}
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
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!isEditing && !isSelectionMode && (
                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEditClick(item); }}
                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        title="Edit Item"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryItemCard;
