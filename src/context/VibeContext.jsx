import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { DAILY_QUESTS, XP_REWARDS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import confetti from 'canvas-confetti';

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
    const [budget, setBudget] = useState(() => loadState('vibe_budget', 0));

    // Daily Quest State
    const [dailyQuest, setDailyQuest] = useState(() => loadState(LOCAL_STORAGE_KEYS.DAILY_QUEST, {
        text: DAILY_QUESTS[0],
        isCompleted: false,
        date: new Date().toDateString()
    }));

    // Chat State
    const [chatMessages, setChatMessages] = useState(() => loadState(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, []));

    // Planner State
    const [tomorrowOutfit, setTomorrowOutfit] = useState(() => loadState(LOCAL_STORAGE_KEYS.TOMORROW_OUTFIT, []));

    // Wishlist State
    const [wishlist, setWishlist] = useState(() => loadState(LOCAL_STORAGE_KEYS.WISHLIST, []));

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
        localStorage.setItem('vibe_budget', JSON.stringify(budget));
    }, [budget]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_QUEST, JSON.stringify(dailyQuest));
    }, [dailyQuest]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOMORROW_OUTFIT, JSON.stringify(tomorrowOutfit));
    }, [tomorrowOutfit]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    }, [wishlist]);

    const logOutfit = useCallback((itemIds = []) => {
        // Calculate Streak
        const today = new Date().toDateString();
        const lastLogDate = userProfile.lastLogDate;
        let newStreak = userProfile.streak || 0;
        let newBadges = userProfile.badges || [];

        // If not logged today
        if (lastLogDate !== today) {
            if (lastLogDate) {
                const lastDate = new Date(lastLogDate);
                const timeDiff = new Date(today).getTime() - lastDate.getTime();
                const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                if (daysDiff === 1) {
                    newStreak += 1;
                } else {
                    newStreak = 1; // Reset if missed a day
                }
            } else {
                newStreak = 1; // First log
            }
        }

        // Trigger Confetti & Badge for 7 days
        if (newStreak === 7 && !newBadges.includes('Fashionista')) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            newBadges = [...newBadges, 'Fashionista'];
        }

        // Award XP & Update Profile
        setUserProfile(prev => ({
            ...prev,
            xp: (prev.xp || 0) + XP_REWARDS.LOG_OUTFIT,
            streak: newStreak,
            lastLogDate: today,
            badges: newBadges
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

    const addToWishlist = useCallback((item) => {
        setWishlist(prev => {
            // Avoid duplicates by ID if possible, or name
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    }, []);

    const removeFromWishlist = useCallback((id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    }, []);

    const buyItem = useCallback((item) => {
        // Remove from wishlist
        setWishlist(prev => prev.filter(i => i.id !== item.id));

        // Add to inventory
        const newItem = {
            ...item,
            wearCount: 0,
            isClean: true,
            dateAdded: new Date().toISOString()
        };
        setInventory(prev => [...prev, newItem]);

        // Deduct budget
        if (item.price) {
            setBudget(prev => prev - parseFloat(item.price));
        }
    }, [setInventory]);

    const clearData = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.INVENTORY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.OUTFIT_LOGS);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.API_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DAILY_QUEST);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOMORROW_OUTFIT);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.WISHLIST);
        setUserProfile({ xp: 0 });
        setInventory([]);
        setOutfitLogs([]);
        setApiKey('');
        setTomorrowOutfit([]);
        setWishlist([]);
        isCompleted: false,
            date: new Date().toDateString()
    });
    setBudget(0);
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
    clearData,
    tomorrowOutfit,
    tomorrowOutfit,
    setTomorrowOutfit,
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    budget,
    setBudget,
    buyItem
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
    logOutfit,
    updateItem,
    clearData,
    updateItem,
    clearData,
    tomorrowOutfit,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    budget,
    buyItem
]);

return (
    <VibeContext.Provider value={value}>
        {children}
    </VibeContext.Provider>
);
};
