import React, { useState, useRef, useEffect } from 'react';
import { User, Sparkles, Trash2 } from 'lucide-react';
import { useVibe } from '../context/VibeContext';
import { generateStyleAdvice } from '../utils/aiService';
import useWeather from '../hooks/useWeather';
import EmptyState from './EmptyState';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { STYLES } from '../utils/styles';

const ChatInterface = () => {
    const { apiKey, userProfile, inventory, chatMessages, setChatMessages } = useVibe();
    const { weather } = useWeather();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

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
                    <a href="/settings" className={STYLES.BUTTON.PRIMARY}>
                        Configure Settings
                    </a>
                </div>
            </div>
        );
    }

    useEffect(() => {
        scrollToBottom();
        // Double check scroll after render to ensure new content sizes are accounted for
        const timeout = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeout);
    }, [chatMessages, isLoading, selectedImage]);

    const handleStarterSelect = (promptText) => {
        setInputValue(promptText);
        submitMessage(promptText);
    };

    const submitMessage = async (text, image = null) => {
        if ((!text.trim() && !image) || isLoading) return;

        const newUserMsg = {
            sender: 'user',
            text: text,
            image: image
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
                        className={STYLES.BUTTON.DANGER}
                        title="Clear Chat & End Session"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <EmptyState onSelect={handleStarterSelect} />
                ) : (
                    chatMessages.map((msg, index) => (
                        <MessageBubble key={index} msg={msg} />
                    ))
                )}
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
            <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isLoading={isLoading}
                onSend={submitMessage}
            />
        </div>
    );
};

export default ChatInterface;
