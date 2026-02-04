import React, { createContext, useState, useEffect, useContext } from 'react';

const VibeContext = createContext();

export const useVibe = () => useContext(VibeContext);

export const VibeProvider = ({ children }) => {
    // Helper to load from local storage or default
    const loadState = (key, defaultValue) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.error(`Error loading ${key} from localStorage`, e);
            return defaultValue;
        }
    };

    // Initialize state from localStorage or defaults
    const [userProfile, setUserProfile] = useState(() => {
        const profile = loadState('userProfile', {});
        // Ensure xp exists
        if (profile.xp === undefined) profile.xp = 0;
        return profile;
    });
    const [inventory, setInventory] = useState(() => loadState('inventory', []));
    const [outfitLogs, setOutfitLogs] = useState(() => loadState('outfitLogs', []));
    const [apiKey, setApiKey] = useState(() => loadState('apiKey', ''));

    // Persist functionality
    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('outfitLogs', JSON.stringify(outfitLogs));
    }, [outfitLogs]);

    useEffect(() => {
        localStorage.setItem('apiKey', JSON.stringify(apiKey));
    }, [apiKey]);

    const logOutfit = (itemIds = []) => {
        // Award XP
        setUserProfile(prev => ({
            ...prev,
            xp: (prev.xp || 0) + 100
        }));

        // Increment wear count for items
        if (itemIds.length > 0) {
            setInventory(prev => prev.map(item => {
                if (itemIds.includes(item.id)) {
                    return { ...item, wearCount: (item.wearCount || 0) + 1 };
                }
                return item;
            }));
        }
    };

    const clearData = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('inventory');
        localStorage.removeItem('outfitLogs');
        localStorage.removeItem('apiKey');
        setUserProfile({ xp: 0 });
        setInventory([]);
        setOutfitLogs([]);
        setApiKey('');
    };

    const value = {
        userProfile,
        setUserProfile,
        inventory,
        setInventory,
        outfitLogs,
        setOutfitLogs,
        apiKey,
        setApiKey,
        logOutfit,
        clearData
    };

    return (
        <VibeContext.Provider value={value}>
            {children}
        </VibeContext.Provider>
    );
};
