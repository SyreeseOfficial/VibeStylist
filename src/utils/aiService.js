import { API_ENDPOINTS, SYSTEM_PROMPTS } from './constants';

export const generateStyleAdvice = async (apiKey, userProfile, inventory, chatHistory, weatherData = null) => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in Settings.");
    }

    // Filter for clean items only
    const cleanInventory = inventory.filter(item => item.isClean);

    const weatherInfo = weatherData ? `${weatherData.temp}°F - ${weatherData.condition}` : "Not available";

    let basePrompt = userProfile.customPersona && userProfile.customPersona.trim() !== ""
        ? userProfile.customPersona
        : SYSTEM_PROMPTS.BASE;

    let systemPrompt = basePrompt
        .replace('{name}', userProfile.name)
        .replace('{fitPreference}', userProfile.fitPreference)
        .replace('{colorPalette}', userProfile.colorPalette)
        .replace('{utilityVsAesthetic}', userProfile.utilityVsAesthetic)
        .replace('{cleanInventory}', JSON.stringify(cleanInventory, null, 2))
        .replace('{weatherInfo}', weatherInfo);

    // Check if the latest message has an image to trigger "Critique Mode"
    const lastMsg = chatHistory[chatHistory.length - 1];

    if (lastMsg && lastMsg.image) {
        systemPrompt += SYSTEM_PROMPTS.CRITIQUE_MODE;
    }

    // Check for Sass Mode
    if (userProfile.sassMode) {
        systemPrompt += SYSTEM_PROMPTS.SASS_MODE;
    }

    // Format history for Gemini API (user/model roles)
    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
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
            `${API_ENDPOINTS.GEMINI_GENERATE}?key=${apiKey}`,
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

export const testApiKeyConnection = async (apiKey) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GEMINI_GENERATE}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello" }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `Error: ${response.status} ${response.statusText}`);
        }

        return true;
    } catch (error) {
        throw error;
    }
};
