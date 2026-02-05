import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { DAILY_QUESTS, XP_REWARDS, LOCAL_STORAGE_KEYS } from '../utils/constants';

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
        const profile = loadState(LOCAL_STORAGE_KEYS.USER_PROFILE, {});
        // Ensure xp exists
        if (profile.xp === undefined) profile.xp = 0;
        return profile;
    });
    const [inventory, setInventory] = useState(() => loadState(LOCAL_STORAGE_KEYS.INVENTORY, []));
    const [outfitLogs, setOutfitLogs] = useState(() => loadState(LOCAL_STORAGE_KEYS.OUTFIT_LOGS, []));
    const [apiKey, setApiKey] = useState(() => loadState(LOCAL_STORAGE_KEYS.API_KEY, ''));
    const [location, setLocation] = useState(() => loadState(LOCAL_STORAGE_KEYS.LOCATION, ''));

    // Daily Quest State
    const [dailyQuest, setDailyQuest] = useState(() => loadState(LOCAL_STORAGE_KEYS.DAILY_QUEST, {
        text: DAILY_QUESTS[0],
        isCompleted: false,
        date: new Date().toDateString()
    }));

    // Chat State
    const [chatMessages, setChatMessages] = useState(() => loadState(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, []));

    // Daily Quest Logic: Rotate if date changed
    useEffect(() => {
        const today = new Date().toDateString();
        if (dailyQuest.date !== today) {
            const randomQuest = DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)];

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
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.OUTFIT_LOGS, JSON.stringify(outfitLogs));
    }, [outfitLogs]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.API_KEY, JSON.stringify(apiKey));
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.LOCATION, JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_QUEST, JSON.stringify(dailyQuest));
    }, [dailyQuest]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
    }, [chatMessages]);

    const logOutfit = useCallback((itemIds = []) => {
        // Award XP
        setUserProfile(prev => ({
            ...prev,
            xp: (prev.xp || 0) + XP_REWARDS.LOG_OUTFIT
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
    }, [inventory, dailyQuest]);

    const updateItem = useCallback((id, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    }, []);

    const completeQuest = useCallback(() => {
        if (!dailyQuest.isCompleted) {
            setDailyQuest(prev => ({ ...prev, isCompleted: true }));
            setUserProfile(prev => ({ ...prev, xp: (prev.xp || 0) + XP_REWARDS.COMPLETE_QUEST }));
        }
    }, [dailyQuest.isCompleted]);

    const clearData = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.INVENTORY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.OUTFIT_LOGS);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.API_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DAILY_QUEST);
        setUserProfile({ xp: 0 });
        setInventory([]);
        setOutfitLogs([]);
        setApiKey('');
        setDailyQuest({
            text: DAILY_QUESTS[0],
            isCompleted: false,
            date: new Date().toDateString()
        });
    }, []);

    const value = useMemo(() => ({
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
    }), [
        userProfile,
        inventory,
        outfitLogs,
        apiKey,
        location,
        dailyQuest,
        chatMessages,
        completeQuest,
        logOutfit,
        updateItem,
        clearData
    ]);

    return (
        <VibeContext.Provider value={value}>
            {children}
        </VibeContext.Provider>
    );
};
