import React, { useRef } from 'react';
import { Send } from 'lucide-react';
import { STYLES } from '../utils/styles';
import { resizeImage } from '../utils/imageUtils';

const ChatInput = ({ inputValue, setInputValue, selectedImage, setSelectedImage, isLoading, onSend }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                setSelectedImage(resizedImage);
            } catch (error) {
                console.error("Error resizing image:", error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !selectedImage) || isLoading) return;
        onSend(inputValue, selectedImage);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800/50 border-t border-gray-700">
            {/* Image Preview */}
            {selectedImage && (
                <div className="mb-2 flex items-center gap-2">
                    <div className="relative group">
                        <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-600" />
                        <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className={STYLES.BUTTON.ICON_BUTTON_DANGER}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <span className="text-xs text-gray-400">Image attached</span>
                </div>
            )}

            <div className="relative flex gap-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition"
                    title="Attach Image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask for outfit advice..."
                    className={STYLES.INPUT.TEXT}
                />
                <button
                    type="submit"
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-700 rounded-lg text-white transition"
                >
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
