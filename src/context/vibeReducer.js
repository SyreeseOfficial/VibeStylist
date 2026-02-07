import { XP_REWARDS } from '../utils/constants';

// Action Types
export const ACTIONS = {
    SET_USER_PROFILE: 'SET_USER_PROFILE',
    SET_INVENTORY: 'SET_INVENTORY',
    SET_LOGS: 'SET_LOGS',
    SET_API_KEY: 'SET_API_KEY',
    SET_LOCATION: 'SET_LOCATION',
    SET_BUDGET: 'SET_BUDGET',
    SET_DAILY_QUEST: 'SET_DAILY_QUEST',
    SET_CHAT_MESSAGES: 'SET_CHAT_MESSAGES',
    SET_TOMORROW_OUTFIT: 'SET_TOMORROW_OUTFIT',
    SET_WISHLIST: 'SET_WISHLIST',
    LOG_OUTFIT: 'LOG_OUTFIT',
    WARN_DIRTY_LOG: 'WARN_DIRTY_LOG', // For the notification logic, though usually side effect
    COMPLETE_QUEST: 'COMPLETE_QUEST',
    LAUNDRY_DAY: 'LAUNDRY_DAY',
    UPDATE_ITEM: 'UPDATE_ITEM',
    ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
    BUY_ITEM: 'BUY_ITEM',
    ADD_ITEM: 'ADD_ITEM',
    CLEAR_DATA: 'CLEAR_DATA'
};

export const vibeReducer = (state, action) => {
    switch (action.type) {
        // --- Basic Setters ---
        case ACTIONS.SET_USER_PROFILE:
            return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
        case ACTIONS.SET_INVENTORY:
            // Allow payload to be a function for flexibility if needed, but usually just value
            const newInventory = typeof action.payload === 'function' ? action.payload(state.inventory) : action.payload;
            return { ...state, inventory: newInventory };
        case ACTIONS.SET_LOGS:
            return { ...state, outfitLogs: action.payload };
        case ACTIONS.SET_API_KEY:
            return { ...state, apiKey: action.payload };
        case ACTIONS.SET_LOCATION:
            return { ...state, location: action.payload };
        case ACTIONS.SET_BUDGET:
            const newBudget = typeof action.payload === 'function' ? action.payload(state.budget) : action.payload;
            return { ...state, budget: newBudget };
        case ACTIONS.SET_DAILY_QUEST:
            const newQuest = typeof action.payload === 'function' ? action.payload(state.dailyQuest) : action.payload;
            return { ...state, dailyQuest: newQuest };
        case ACTIONS.SET_CHAT_MESSAGES:
            const newMsgs = typeof action.payload === 'function' ? action.payload(state.chatMessages) : action.payload;
            return { ...state, chatMessages: newMsgs };
        case ACTIONS.SET_TOMORROW_OUTFIT:
            const newOutfit = typeof action.payload === 'function' ? action.payload(state.tomorrowOutfit) : action.payload;
            return { ...state, tomorrowOutfit: newOutfit };
        case ACTIONS.SET_WISHLIST:
            const newWishlist = typeof action.payload === 'function' ? action.payload(state.wishlist) : action.payload;
            return { ...state, wishlist: newWishlist };

        // --- Complex Logic ---
        case ACTIONS.LOG_OUTFIT: {
            // payload: { itemIds, date, soundEffectsEnabled }
            const { itemIds, date } = action.payload;
            const { userProfile, inventory, dailyQuest, outfitLogs } = state;

            // 1. Calculate Streak
            const lastLogDate = userProfile.lastLogDate;
            let newStreak = userProfile.streak || 0;
            let newBadges = userProfile.badges || [];

            if (lastLogDate !== date) {
                if (lastLogDate) {
                    const lastDateObj = new Date(lastLogDate);
                    const todayDateObj = new Date(date);
                    const timeDiff = todayDateObj.getTime() - lastDateObj.getTime();
                    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                    if (daysDiff === 1) {
                        newStreak += 1;
                    } else {
                        newStreak = 1;
                    }
                } else {
                    newStreak = 1;
                }
            }

            // 2. Badge Checks (moved partially to effect/helper in component, but state updates here)
            // Simplified: just check the 7-day streak here
            let justEarnedFashionista = false;
            if (newStreak === 7 && !newBadges.includes('Fashionista')) {
                newBadges = [...newBadges, 'Fashionista'];
                justEarnedFashionista = true;
            }

            // 3. Update XP & Profile
            const updatedProfile = {
                ...userProfile,
                xp: (userProfile.xp || 0) + XP_REWARDS.LOG_OUTFIT,
                streak: newStreak,
                lastLogDate: date,
                badges: newBadges
            };

            // 4. Create Log Entry
            const newLog = {
                id: Date.now().toString(),
                date: new Date().toISOString(), // Full ISO for log, date string for streak
                items: inventory.filter(item => itemIds.includes(item.id)),
                vibeScore: Math.floor(Math.random() * 10) + 85,
                questCompleted: dailyQuest.isCompleted ? dailyQuest.text : null,
            };

            // 5. Increment wear counts
            const updatedInventory = inventory.map(item => {
                if (itemIds.includes(item.id)) {
                    return { ...item, wearCount: (item.wearCount || 0) + 1 };
                }
                return item;
            });

            return {
                ...state,
                userProfile: updatedProfile,
                outfitLogs: [newLog, ...outfitLogs],
                inventory: updatedInventory,
                // Pass flags to UI for side effects (confetti, sounds)
                _sideEffect: {
                    type: 'LOG_SUCCESS',
                    earnedBadge: justEarnedFashionista ? 'Fashionista' : null,
                    xpEarned: XP_REWARDS.LOG_OUTFIT,
                    source: "Outfit Logged"
                }
            };
        }

        case ACTIONS.COMPLETE_QUEST: {
            if (state.dailyQuest.isCompleted) return state;

            return {
                ...state,
                dailyQuest: { ...state.dailyQuest, isCompleted: true },
                userProfile: {
                    ...state.userProfile,
                    xp: (state.userProfile.xp || 0) + XP_REWARDS.COMPLETE_QUEST
                },
                _sideEffect: {
                    type: 'QUEST_COMPLETE',
                    xpEarned: XP_REWARDS.COMPLETE_QUEST,
                    source: "Quest Completed"
                }
            };
        }

        case ACTIONS.LAUNDRY_DAY: {
            // Find dirty items
            const dirtyItems = state.inventory.filter(item => !item.isClean);
            if (dirtyItems.length === 0) return state; // Or return generic "Nothing to clean" info?

            const xpEarned = Math.min(dirtyItems.length * XP_REWARDS.LAUNDRY_ITEM, XP_REWARDS.LAUNDRY_MAX);

            const cleanInventory = state.inventory.map(item => ({ ...item, isClean: true }));

            return {
                ...state,
                inventory: cleanInventory,
                userProfile: {
                    ...state.userProfile,
                    xp: (state.userProfile.xp || 0) + xpEarned
                },
                _sideEffect: {
                    type: 'LAUNDRY_COMPLETE',
                    count: dirtyItems.length,
                    xp: xpEarned,
                    xpEarned: xpEarned, // Duplicate for consistency in listener
                    source: "Laundry Done"
                }
            };
        }

        case ACTIONS.UPDATE_ITEM: {
            const { id, updates } = action.payload;
            const newInv = state.inventory.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            return { ...state, inventory: newInv };
        }

        case ACTIONS.ADD_ITEM: {
            const newItem = action.payload;
            return {
                ...state,
                inventory: [...state.inventory, newItem],
                userProfile: {
                    ...state.userProfile,
                    xp: (state.userProfile.xp || 0) + XP_REWARDS.ADD_ITEM
                },
                _sideEffect: {
                    type: 'ADD_ITEM_SUCCESS',
                    xpEarned: XP_REWARDS.ADD_ITEM,
                    source: "New Item Added"
                }
            };
        }

        case ACTIONS.ADD_TO_WISHLIST: {
            const newItem = action.payload;
            if (state.wishlist.some(i => i.id === newItem.id)) return state;
            return {
                ...state,
                wishlist: [...state.wishlist, newItem],
                userProfile: {
                    ...state.userProfile,
                    xp: (state.userProfile.xp || 0) + XP_REWARDS.WISHLIST_ADD
                },
                _sideEffect: {
                    type: 'WISHLIST_ADD_SUCCESS',
                    xpEarned: XP_REWARDS.WISHLIST_ADD,
                    source: "Added to Wishlist"
                }
            };
        }

        case ACTIONS.REMOVE_FROM_WISHLIST:
            return { ...state, wishlist: state.wishlist.filter(i => i.id !== action.payload) };

        case ACTIONS.BUY_ITEM: {
            const item = action.payload;
            // Remove from wishlist
            const newWishlist = state.wishlist.filter(i => i.id !== item.id);

            // Add to Inventory
            const newItem = {
                ...item,
                wearCount: 0,
                isClean: true, // New items are clean
                dateAdded: new Date().toISOString()
            };

            // Deduct Budget
            let newBudget = state.budget;
            if (item.price) {
                newBudget = state.budget - parseFloat(item.price);
            }

            return {
                ...state,
                wishlist: newWishlist,
                inventory: [...state.inventory, newItem],
                budget: newBudget,
                userProfile: {
                    ...state.userProfile,
                    xp: (state.userProfile.xp || 0) + XP_REWARDS.ADD_ITEM
                },
                _sideEffect: {
                    type: 'BUY_ITEM_SUCCESS',
                    xpEarned: XP_REWARDS.ADD_ITEM,
                    source: "Item Purchased"
                }
            };
        }

        case ACTIONS.CLEAR_DATA:
            return action.payload; // Payload contains the clean initial state

        default:
            return state;
    }
};
