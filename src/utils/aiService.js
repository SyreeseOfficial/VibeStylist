export const generateStyleAdvice = async (apiKey, userProfile, inventory, chatHistory, weatherData = null) => {
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

Current Weather:
${weatherData ? `${weatherData.temp}°F - ${weatherData.condition}` : "Not available"}


Instructions:
1. Suggest a cohesive outfit using ONLY the items listed in the inventory.
2. Explain why this outfit matches their "vibe" (preferences).
3. If they don't have enough items (e.g., missing shoes or bottoms), suggest what they should buy to complete the look.
3. If they don't have enough items (e.g., missing shoes or bottoms), suggest what they should buy to complete the look.
4. Keep the tone helpful, stylish, and concise.

Weather-Specific Rules:
- If rain/drizzle is detected, strictly warn against suede or canvas shoes.
- If temp > 75°F (24°C), discourage heavy layering (thick knits, jackets).
- Always reference the specific weather condition in your advice (e.g., "Since it's 52°F and raining...").
`;

    // Check if the latest message has an image to trigger "Critique Mode"
    const lastMsg = chatHistory[chatHistory.length - 1];
    let finalSystemPrompt = systemPrompt;

    if (lastMsg && lastMsg.image) {
        finalSystemPrompt += `
\n*** OUTFIT CRITIQUE MODE ACTIVATED ***
The user has provided an image. Ignore standard inventory suggestions if they are asking about the image.
Analyze this outfit image explicitly.
Critique the fit, color coordination, and silhouette based on the user's style goals.
Give a rating out of 10.
`;
    }

    // Format history for Gemini API (user/model roles)
    const contents = [
        {
            role: "user",
            parts: [{ text: finalSystemPrompt }]
        },
        ...chatHistory.map(msg => {
            const parts = [{ text: msg.text }];

            if (msg.image) {
                // msg.image is expected to be a Base64 string like "data:image/jpeg;base64,..."
                const [header, data] = msg.image.split(',');
                const mimeType = header.match(/:(.*?);/)[1];

                parts.push({
                    inline_data: {
                        mime_type: mimeType,
                        data: data
                    }
                });
            }

            return {
                role: msg.sender === 'ai' ? 'model' : 'user',
                parts: parts
            };
        })
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
