import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { useVibe } from '../context/VibeContext';
import { Shirt, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { inventory } = useVibe();

    if (inventory.length === 0) {
        return (
            <div className="flex-1 p-8 h-full flex items-center justify-center">
                <div className="max-w-2xl w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-900/20 animate-pulse">
                        <Shirt size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Welcome to VibeStylist</h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
                        Your digital wardrobe is currently empty. Add your first item to start tracking your fits and getting AI advice.
                    </p>
                    <Link
                        to="/inventory"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={20} />
                        <span>Add First Item</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 h-full">
            <ChatInterface />
        </div>
    );
};

export default DashboardHome;
