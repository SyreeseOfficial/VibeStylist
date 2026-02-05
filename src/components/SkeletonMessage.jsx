import React from 'react';

const SkeletonMessage = () => {
    return (
        <div className="flex w-full justify-start animate-fade-in">
            <div className="flex max-w-[80%] md:max-w-[70%] gap-3 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-800 border border-gray-700">
                    <div className="w-4 h-4 rounded-full bg-gray-700 animate-pulse" />
                </div>

                <div className="p-4 rounded-2xl bg-gray-800 border border-gray-700 rounded-tl-none w-64 space-y-2">
                    {/* Title-like line */}
                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />

                    {/* Body lines */}
                    <div className="h-3 bg-gray-700/50 rounded w-full animate-pulse delay-75" />
                    <div className="h-3 bg-gray-700/50 rounded w-5/6 animate-pulse delay-100" />
                    <div className="h-3 bg-gray-700/50 rounded w-4/5 animate-pulse delay-150" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonMessage;
