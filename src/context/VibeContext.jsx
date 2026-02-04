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
    const [userProfile, setUserProfile] = useState(() => loadState('userProfile', {}));
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

    const clearData = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('inventory');
        localStorage.removeItem('outfitLogs');
        localStorage.removeItem('apiKey');
        setUserProfile({});
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
        clearData
    };

    return (
        <VibeContext.Provider value={value}>
            {children}
        </VibeContext.Provider>
    );
};
