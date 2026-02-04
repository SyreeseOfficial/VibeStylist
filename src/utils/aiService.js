export const generateStyleAdvice = async (apiKey, userProfile, inventory, chatHistory) => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in Settings.");
    }

    // Filter for clean items only
    const cleanInventory = inventory.filter(item => item.isClean);

    // Construct System Prompt
    const systemPrompt = `
You are VibeStylist, an AI fashion assistant.
Your goal is to suggest outfits based on the user's available (clean) wardrobe and their style preferences.

User Profile:
- Name: ${userProfile.name}
- Fit Preference (0-100, Tight to Loose): ${userProfile.fitPreference}
- Color Palette (0-100, Neutral to Vibrant): ${userProfile.colorPalette}
- Style Priority (0-100, Utility to Aesthetic): ${userProfile.utilityVsAesthetic}

Available Clean Inventory:
${JSON.stringify(cleanInventory, null, 2)}

Instructions:
1. Suggest a cohesive outfit using ONLY the items listed in the inventory.
2. Explain why this outfit matches their "vibe" (preferences).
3. If they don't have enough items (e.g., missing shoes or bottoms), suggest what they should buy to complete the look.
4. Keep the tone helpful, stylish, and concise.
`;

    // Format history for Gemini API (user/model roles)
    // Assuming chatHistory is array of { role: 'user' | 'model', text: string }
    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
        },
        ...chatHistory.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user', // Map local roles to API roles if needed
            parts: [{ text: msg.text }]
        }))
    ];

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch response from Gemini");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};
