import React, { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react';
import { DAILY_QUESTS, LOCAL_STORAGE_KEYS } from '../utils/constants'; // Removed XP_REWARDS unused import if any
import confetti from 'canvas-confetti';
import { playSound, SOUNDS } from '../utils/soundEffects';
import { vibeReducer, ACTIONS } from './vibeReducer';
import { toast } from 'sonner';

// Split Contexts
const VibeStateContext = createContext();
const VibeDispatchContext = createContext();

// Hooks for specific contexts
export const useVibeState = () => {
    const context = useContext(VibeStateContext);
    if (context === undefined) {
        throw new Error('useVibeState must be used within a VibeProvider');
    }
    return context;
};

export const useVibeDispatch = () => {
    const context = useContext(VibeDispatchContext);
    if (context === undefined) {
        throw new Error('useVibeDispatch must be used within a VibeProvider');
    }
    return context;
};

// Legacy hook for backward compatibility
export const useVibe = () => {
    const state = useVibeState();
    const dispatch = useVibeDispatch();
    return useMemo(() => ({ ...state, ...dispatch }), [state, dispatch]);
};

export const VibeProvider = ({ children }) => {

    // --- 1. Load Initial State via useLocalStorage ---
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
    useEffect(() => {
        if (state._sideEffect) {
            const { type, earnedBadge } = state._sideEffect;
            const soundEnabled = state.userProfile.soundEffects !== false;

            if (type === 'LOG_SUCCESS') {
                playSound(SOUNDS.LEVEL_UP, soundEnabled);
                if (earnedBadge === 'Fashionista') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                    toast.success("Badge Unlocked: Fashionista! + Streak Bonus!");
                }
            } else if (type === 'QUEST_COMPLETE') {
                playSound(SOUNDS.LEVEL_UP, soundEnabled);
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

    // MEMOIZED DISPATCH ACTIONS
    const dispatchActions = useMemo(() => {
        const setUserProfile = (payload) => {
            // We can't access live state here easily for function updates if we want this constant.
            // BUT, we can make this a thunk if we had middleware, or just pass dispatch exposed.
            // For now, to keep it simple and memoized:
            // If payload is function, we can't support it purely in this memo without state dependency.
            // HOWEVER, we CAN just dispatch the action and let reducer handle it? No, reducer needs pure data usually.
            // Reverting to the pattern of including state dependency for `setUserProfile` if we really need function support,
            // OR, better: Consumers should pass the computed value or we accept that setUserProfile changes when state.userProfile changes.
            // Actually, to make Context split useful, actions shouldn't change when state changes.
            // The previous implementation of setUserProfile depended on state.userProfile.
            // Let's change the pattern: The reducer should ideally handle logic, but typical Redux pattern allows pure dispatch.
            // For now, I will NOT include state dependency here to ensure stability.
            // Consumers must pass the new value, or we use a functional state update pattern in reducer if supported (it's not currently).
            // WAIT: The previous code handled functional updates manually.
            // To keep optimization, I will REMOVE functional update support from this helper OR
            // I'll leave it but it will require access to state, effectively breaking the split benefit for that one action.
            // Best approach: Expose raw `dispatch` via `useVibeDispatch` effectively?
            // Let's stick to the list of helpers but remove the functional update hack dependency if possible,
            // OR just re-create the object.
            // Actually, `state.userProfile` is the ONLY dependency that caused churn in `setUserProfile`.
            // Let's move the functional check to the SITE of call if possible, or just accept that `setUserProfile` might rebuild.
            // BUT, `setInventory` and others don't need state.

            dispatch({ type: ACTIONS.SET_USER_PROFILE, payload });
        };

        return {
            dispatch, // Escape hatch
            setUserProfile, // Warning: This no longer supports functional updates automatically if we want it stable.
            // If we need functional updates, we should pass (prev) => new in the hook usage? 
            // The reducer is standard.
            // I will keep the simple version here. **If code relies on functional updates, it might break.**
            // Checking usages: InventoryPage uses `setUserProfile(prev => ...)`
            // FIX: I will change InventoryPage to read state then set it.

            setInventory: (payload) => dispatch({ type: ACTIONS.SET_INVENTORY, payload }),
            setOutfitLogs: (payload) => dispatch({ type: ACTIONS.SET_LOGS, payload }),
            setApiKey: (payload) => dispatch({ type: ACTIONS.SET_API_KEY, payload }),
            setLocation: (payload) => dispatch({ type: ACTIONS.SET_LOCATION, payload }),
            setBudget: (payload) => dispatch({ type: ACTIONS.SET_BUDGET, payload }),
            setChatMessages: (payload) => dispatch({ type: ACTIONS.SET_CHAT_MESSAGES, payload }),
            setTomorrowOutfit: (payload) => dispatch({ type: ACTIONS.SET_TOMORROW_OUTFIT, payload }),
            setWishlist: (payload) => dispatch({ type: ACTIONS.SET_WISHLIST, payload }),

            logOutfit: (itemIds) => dispatch({ type: ACTIONS.LOG_OUTFIT, payload: { itemIds, date: new Date().toDateString() } }),
            completeQuest: () => dispatch({ type: ACTIONS.COMPLETE_QUEST }),
            updateItem: (id, updates) => dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { id, updates } }),
            addToWishlist: (item) => dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: item }),
            removeFromWishlist: (id) => dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: id }),
            buyItem: (item) => dispatch({ type: ACTIONS.BUY_ITEM, payload: item }),

            clearData: () => {
                const defaults = {
                    userProfile: { xp: 0, streak: 0, soundEffects: true },
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
                Object.values(LOCAL_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
                localStorage.removeItem('vibe_budget');
                dispatch({ type: ACTIONS.CLEAR_DATA, payload: defaults });
            },

            handleLaundryDay: () => dispatch({ type: ACTIONS.LAUNDRY_DAY })
        };
    }, []); // No dependencies! Completely stable.

    // Re-add functional update support for setUserProfile by using a ref or just accessing state in a non-dep way?
    // No, cleaner to just fix the call site in InventoryPage.

    return (
        <VibeStateContext.Provider value={state}>
            <VibeDispatchContext.Provider value={dispatchActions}>
                {children}
            </VibeDispatchContext.Provider>
        </VibeStateContext.Provider>
    );
};
