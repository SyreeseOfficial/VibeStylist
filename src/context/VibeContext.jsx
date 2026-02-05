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
    const [location, setLocation] = useState(() => loadState('location', ''));

    // Daily Quest State
    const [dailyQuest, setDailyQuest] = useState(() => loadState('dailyQuest', {
        text: "Wear a blue item today",
        isCompleted: false,
        date: new Date().toDateString()
    }));

    // Chat State (Moved from ChatInterface)
    const [chatMessages, setChatMessages] = useState(() => loadState('chatMessages', []));

    // Daily Quest Logic: Rotate if date changed
    useEffect(() => {
        const today = new Date().toDateString();
        if (dailyQuest.date !== today) {
            const quests = [
                "Wear a blue item today",
                "Try a monochrome fit",
                "Wear your oldest item",
                "Style a formal piece casually",
                "Wear something green",
                "Create a layered outfit",
                "Wear your newest item"
            ];
            const randomQuest = quests[Math.floor(Math.random() * quests.length)];

            const newQuest = {
                text: randomQuest,
                isCompleted: false,
                date: today
            };
            setDailyQuest(newQuest);
        }
    }, [dailyQuest.date]); // Check on mount/update if date matches

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

    useEffect(() => {
        localStorage.setItem('location', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('dailyQuest', JSON.stringify(dailyQuest));
    }, [dailyQuest]);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    const logOutfit = (itemIds = []) => {
        // Award XP
        setUserProfile(prev => ({
            ...prev,
            xp: (prev.xp || 0) + 100
        }));

        // Create Log Entry
        const newLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: inventory.filter(item => itemIds.includes(item.id)), // Snapshot of items
            vibeScore: Math.floor(Math.random() * 10) + 85, // Dummy Vibe Score for now
            questCompleted: dailyQuest.isCompleted ? dailyQuest.text : null,
        };

        setOutfitLogs(prev => [newLog, ...prev]);

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

    const updateItem = (id, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const completeQuest = () => {
        if (!dailyQuest.isCompleted) {
            setDailyQuest(prev => ({ ...prev, isCompleted: true }));
            setUserProfile(prev => ({ ...prev, xp: (prev.xp || 0) + 150 }));
        }
    };

    const clearData = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('inventory');
        localStorage.removeItem('outfitLogs');
        localStorage.removeItem('apiKey');
        localStorage.removeItem('dailyQuest');
        setUserProfile({ xp: 0 });
        setInventory([]);
        setOutfitLogs([]);
        setApiKey('');
        setDailyQuest({
            text: "Wear a blue item today",
            isCompleted: false,
            date: new Date().toDateString()
        });
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
        location,
        setLocation,
        dailyQuest,
        completeQuest,
        chatMessages,
        setChatMessages,
        logOutfit,
        updateItem,
        clearData
    };

    return (
        <VibeContext.Provider value={value}>
            {children}
        </VibeContext.Provider>
    );
};
