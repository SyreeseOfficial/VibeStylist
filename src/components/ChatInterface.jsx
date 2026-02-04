import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { useVibe } from '../context/VibeContext';
import { generateStyleAdvice } from '../utils/aiService';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm VibeStylist. How can I help you regarding your wardrobe today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { userProfile, inventory, apiKey } = useVibe();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue;
        const newUserMsg = { sender: 'user', text: userText };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiResponseText = await generateStyleAdvice(
                apiKey,
                userProfile,
                inventory,
                [...messages, newUserMsg]
            );

            setMessages(prev => [...prev, {
                sender: 'ai',
                text: aiResponseText
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: `Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden shadow-inner md:border border-gray-800">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-purple-600'
                                }`}>
                                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-blue-600/20 text-blue-100 border border-blue-600/30 rounded-tr-none'
                                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                                }`}>
                                {msg.text}
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
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask for outfit advice..."
                        className="w-full bg-gray-900 border border-gray-600 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
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
