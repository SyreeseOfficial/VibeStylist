import React, { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react';
import { DAILY_QUESTS, XP_REWARDS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import confetti from 'canvas-confetti';
import { playSound, SOUNDS } from '../utils/soundEffects';
import useLocalStorage from '../hooks/useLocalStorage';
import { vibeReducer, ACTIONS } from './vibeReducer';
import { toast } from 'sonner';

const VibeContext = createContext();

export const useVibe = () => useContext(VibeContext);

export const VibeProvider = ({ children }) => {

    // --- 1. Load Initial State via useLocalStorage ---
    // We use useLocalStorage for each key to ensure it stays in sync
    // However, for the reducer, we need a composite initial state.
    // Stratergy: Load all from useLocalStorage first, then pass to reducer?
    // OR: Use reducer for logic, but sync each part to useLocalStorage using effects.
    // Best practice for complex persistence:
    // Keep source of truth in Reducer state, and use useEffect to write to LS.
    // Initialization: Custom lazy initializer.

    const initializer = () => {
        const load = (key, def) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : def;
            } catch (e) {
                console.error(e);
                return def;
            }
        };

        return {
            userProfile: load(LOCAL_STORAGE_KEYS.USER_PROFILE, { xp: 0, streak: 0, soundEffects: true, customPersona: "" }),
            inventory: load(LOCAL_STORAGE_KEYS.INVENTORY, []),
            outfitLogs: load(LOCAL_STORAGE_KEYS.OUTFIT_LOGS, []),
            apiKey: load(LOCAL_STORAGE_KEYS.API_KEY, ''),
            location: load(LOCAL_STORAGE_KEYS.LOCATION, ''),
            budget: load('vibe_budget', 0),
            dailyQuest: load(LOCAL_STORAGE_KEYS.DAILY_QUEST, {
                text: DAILY_QUESTS[0],
                isCompleted: false,
                date: new Date().toDateString()
            }),
            chatMessages: load(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, []),
            tomorrowOutfit: load(LOCAL_STORAGE_KEYS.TOMORROW_OUTFIT, []),
            wishlist: load(LOCAL_STORAGE_KEYS.WISHLIST, [])
        };
    };

    const [state, dispatch] = useReducer(vibeReducer, {}, initializer);

    // --- 2. Persistence Effects ---
    // We could use key-specific effects, or one big one.
    // Key-specific is safer for performance if state is huge, but here it's fine.
    // Actually, useLocalStorage hook handles the "write" part if we used it directly.
    // Since we are using a Reducer, we manually sync changes to LS.

    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PROFILE, JSON.stringify(state.userProfile)); }, [state.userProfile]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(state.inventory)); }, [state.inventory]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.OUTFIT_LOGS, JSON.stringify(state.outfitLogs)); }, [state.outfitLogs]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.API_KEY, JSON.stringify(state.apiKey)); }, [state.apiKey]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.LOCATION, JSON.stringify(state.location)); }, [state.location]);
    useEffect(() => { localStorage.setItem('vibe_budget', JSON.stringify(state.budget)); }, [state.budget]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_QUEST, JSON.stringify(state.dailyQuest)); }, [state.dailyQuest]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(state.chatMessages)); }, [state.chatMessages]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.TOMORROW_OUTFIT, JSON.stringify(state.tomorrowOutfit)); }, [state.tomorrowOutfit]);
    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(state.wishlist)); }, [state.wishlist]);

    // --- 3. Side Effects Logic (Confetti, Sounds, Toasts) ---
    // The reducer sets a transient flag '_sideEffect' used here.
    useEffect(() => {
        if (state._sideEffect) {
            const { type, earnedBadge, count, xp } = state._sideEffect;
            const soundEnabled = state.userProfile.soundEffects !== false; // Default true

            if (type === 'LOG_SUCCESS') {
                playSound(SOUNDS.LEVEL_UP, soundEnabled);
                if (earnedBadge === 'Fashionista') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                    toast.success("Badge Unlocked: Fashionista! + Streak Bonus!");
                }
            } else if (type === 'QUEST_COMPLETE') {
                playSound(SOUNDS.LEVEL_UP, soundEnabled);
            } else if (type === 'LAUNDRY_COMPLETE') {
                // Laundry specific animation could be triggered here or in UI
                // toast handled in UI or here? Let's keep UI toasts in UI for now if possible,
                // but consistency says here.
                // The hook used to do it.
            }
        }
    }, [state._sideEffect, state.userProfile.soundEffects]);


    // --- 4. Logic & Handlers (Wrappers for Dispatch) ---

    // Daily Quest Rotation Check
    useEffect(() => {
        const today = new Date().toDateString();
        if (state.dailyQuest.date !== today) {
            const randomQuest = DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)];
            dispatch({
                type: ACTIONS.SET_DAILY_QUEST,
                payload: { text: randomQuest, isCompleted: false, date: today }
            });
        }
    }, [state.dailyQuest.date]);

    // Public Actions (Memoized to prevent re-renders)

    const setUserProfile = useCallback((payload) => {
        // Handle function updates: setUserProfile(prev => ...)
        if (typeof payload === 'function') {
            // This is tricky with reducer. ideally we pass value.
            // But to support existing Component code that does setUserProfile(prev => ...),
            // we need to access current state.
            // The reducer doesn't support thunks out of the box without middleware.
            // Hack: calc value here.
            dispatch({ type: ACTIONS.SET_USER_PROFILE, payload: payload(state.userProfile) });
        } else {
            dispatch({ type: ACTIONS.SET_USER_PROFILE, payload });
        }
    }, [state.userProfile]);

    const setInventory = useCallback((payload) => dispatch({ type: ACTIONS.SET_INVENTORY, payload }), []);
    const setOutfitLogs = useCallback((payload) => dispatch({ type: ACTIONS.SET_LOGS, payload }), []);
    const setApiKey = useCallback((payload) => dispatch({ type: ACTIONS.SET_API_KEY, payload }), []);
    const setLocation = useCallback((payload) => dispatch({ type: ACTIONS.SET_LOCATION, payload }), []);
    const setBudget = useCallback((payload) => dispatch({ type: ACTIONS.SET_BUDGET, payload }), []);
    const setChatMessages = useCallback((payload) => dispatch({ type: ACTIONS.SET_CHAT_MESSAGES, payload }), []);
    const setTomorrowOutfit = useCallback((payload) => dispatch({ type: ACTIONS.SET_TOMORROW_OUTFIT, payload }), []);
    const setWishlist = useCallback((payload) => dispatch({ type: ACTIONS.SET_WISHLIST, payload }), []);

    const logOutfit = useCallback((itemIds) => {
        dispatch({ type: ACTIONS.LOG_OUTFIT, payload: { itemIds, date: new Date().toDateString() } });
    }, []);

    const completeQuest = useCallback(() => {
        dispatch({ type: ACTIONS.COMPLETE_QUEST });
    }, []);

    const updateItem = useCallback((id, updates) => {
        dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { id, updates } });
    }, []);

    const addToWishlist = useCallback((item) => {
        // Simple duplicate check moved to reducer or here
        dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: item });
    }, []);

    const removeFromWishlist = useCallback((id) => {
        dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: id });
    }, []);

    const buyItem = useCallback((item) => {
        dispatch({ type: ACTIONS.BUY_ITEM, payload: item });
    }, []);

    const clearData = useCallback(() => {
        // Reset to defaults
        const defaults = {
            userProfile: { xp: 0, streak: 0, soundEffects: true }, // Keep essential defaults
            inventory: [],
            outfitLogs: [],
            apiKey: '',
            location: '',
            budget: 0,
            dailyQuest: { text: DAILY_QUESTS[0], isCompleted: false, date: new Date().toDateString() },
            chatMessages: [],
            tomorrowOutfit: [],
            wishlist: []
        };
        // Clear Local Storage
        Object.values(LOCAL_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        localStorage.removeItem('vibe_budget');

        dispatch({ type: ACTIONS.CLEAR_DATA, payload: defaults });
    }, []);

    // Laundry helper specifically for the UI button
    const handleLaundryDay = useCallback(() => {
        dispatch({ type: ACTIONS.LAUNDRY_DAY });
    }, []);

    const value = useMemo(() => ({
        ...state, // Spread state properties (userProfile, inventory, etc.)
        setUserProfile,
        setInventory, // Exposed for direct manipulation if really needed, but try to use actions
        setOutfitLogs,
        setApiKey,
        setLocation,
        setBudget,
        setChatMessages,
        setTomorrowOutfit,
        setWishlist,
        logOutfit,
        completeQuest,
        updateItem,
        addToWishlist,
        removeFromWishlist,
        buyItem,
        clearData,
        handleLaundryDay // Exposed action for button
    }), [
        state,
        setUserProfile,
        setInventory,
        setOutfitLogs,
        setApiKey,
        setLocation,
        setBudget,
        setChatMessages,
        setTomorrowOutfit,
        setWishlist,
        logOutfit,
        completeQuest,
        updateItem,
        addToWishlist,
        removeFromWishlist,
        buyItem,
        clearData,
        handleLaundryDay
    ]);

    return (
        <VibeContext.Provider value={value}>
            {children}
        </VibeContext.Provider>
    );
};
