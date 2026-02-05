import React from 'react';
import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ msg }) => {
    const isUser = msg.sender === 'user';

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[80%] md:max-w-[70%] gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                        }`}>
                        {isUser ? <User size={16} /> : <Sparkles size={16} />}
                    </div>

                    {/* Content Bubble */}
                    <div className={`flex flex-col gap-2 p-3 rounded-2xl text-sm leading-relaxed ${isUser
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
                        {msg.text && (
                            <div className={`markdown-content ${!isUser ? 'prose prose-invert prose-sm max-w-none text-gray-200' : ''}`}>
                                {!isUser ? <ReactMarkdown>{msg.text}</ReactMarkdown> : <p>{msg.text}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
