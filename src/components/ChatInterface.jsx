import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Trash2 } from 'lucide-react';
import { useVibe } from '../context/VibeContext';
import { generateStyleAdvice } from '../utils/aiService';
import useWeather from '../hooks/useWeather';

const ChatInterface = () => {
    const { apiKey, userProfile, inventory, chatMessages, setChatMessages } = useVibe();
    const { weather } = useWeather();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!apiKey) {
        return (
            <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden shadow-inner md:border border-gray-800 items-center justify-center p-8 text-center bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
                <div className="relative z-10 max-w-md">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-lg">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-mono-system">Stylist Implementation Missing</h2>
                    <p className="text-gray-400 mb-6">
                        I need my brain to function! Please configure your Google Gemini API Key in the settings to start our style session.
                    </p>
                    <a href="/settings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition shadow-lg hover:shadow-blue-500/20">
                        Configure Settings
                    </a>
                </div>
            </div>
        );
    }

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isLoading, selectedImage]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !selectedImage) || isLoading) return;

        const userText = inputValue;
        const newUserMsg = {
            sender: 'user',
            text: userText,
            image: selectedImage
        };

        setChatMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const aiResponseText = await generateStyleAdvice(
                apiKey,
                userProfile,
                inventory,
                [...chatMessages, newUserMsg],
                weather
            );

            setChatMessages(prev => [...prev, {
                sender: 'ai',
                text: aiResponseText
            }]);
        } catch (error) {
            setChatMessages(prev => [...prev, {
                sender: 'ai',
                text: `Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden shadow-inner md:border border-gray-800">
            {/* Header */}
            <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" />
                    <span className="font-semibold text-gray-200">AI Stylist</span>
                </div>
                {chatMessages.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm('Clear chat history? This will end the current session.')) {
                                setChatMessages([]);
                            }
                        }}
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-400 transition px-2 py-1 rounded hover:bg-gray-800"
                        title="Clear Chat & End Session"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col max-w-[80%] md:max-w-[70%] gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-purple-600'
                                    }`}>
                                    {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                </div>

                                {/* Content Bubble */}
                                <div className={`flex flex-col gap-2 p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-blue-600/20 text-blue-100 border border-blue-600/30 rounded-tr-none'
                                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                                    }`}>
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="User upload"
                                            className="rounded-lg max-w-full h-auto max-h-[200px] object-cover border border-white/10"
                                        />
                                    )}
                                    {msg.text && <p>{msg.text}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex w-full justify-start">
                        <div className="flex max-w-[80%] md:max-w-[70%] gap-3 flex-row">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-600">
                                <Sparkles size={16} className="animate-pulse" />
                            </div>
                            <div className="p-3 rounded-2xl text-sm leading-relaxed bg-gray-800 text-gray-400 border border-gray-700 rounded-tl-none italic">
                                Thinking...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-gray-800/50 border-t border-gray-700">
                {/* Image Preview */}
                {selectedImage && (
                    <div className="mb-2 flex items-center gap-2">
                        <div className="relative group">
                            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-600" />
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
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
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
        </div>
    );
};

export default ChatInterface;
