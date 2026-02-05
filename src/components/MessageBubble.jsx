import { User, Sparkles, Plus, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVibe } from '../context/VibeContext';

const MessageBubble = ({ msg }) => {
    const isUser = msg.sender === 'user';
    const { wishlist, addToWishlist, removeFromWishlist } = useVibe();

    // Custom renderer for Wishlist links
    const WishlistLink = ({ href, children }) => {
        if (href?.startsWith('wishlist:')) {
            const itemName = decodeURIComponent(href.replace('wishlist:', ''));
            const isInWishlist = wishlist.includes(itemName);

            return (
                <button
                    onClick={() => isInWishlist ? removeFromWishlist(itemName) : addToWishlist(itemName)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-md text-xs font-medium transition-colors ${isInWishlist
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'
                        }`}
                >
                    {isInWishlist ? (
                        <>
                            <Check size={12} />
                            {children}
                            <span className="opacity-70 ml-1">(Added)</span>
                        </>
                    ) : (
                        <>
                            <Plus size={12} />
                            Add "{children}"
                        </>
                    )}
                </button>
            );
        }
        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>;
    };

    // Pre-process text to convert [[Item]] to [Item](wishlist:Item)
    const processedText = msg.text ? msg.text.replace(/\[\[(.*?)\]\]/g, '[$1](wishlist:$1)') : '';

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
                                {!isUser ? (
                                    <ReactMarkdown components={{ a: WishlistLink }}>
                                        {processedText}
                                    </ReactMarkdown>
                                ) : (
                                    <p>{msg.text}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
