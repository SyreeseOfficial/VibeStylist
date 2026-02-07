import { API_ENDPOINTS, SYSTEM_PROMPTS, LOCAL_STORAGE_KEYS, GEMINI_MODELS } from './constants';

const getApiKey = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEY);
        if (!stored) return '';
        const parsed = JSON.parse(stored);
        return parsed || '';
    } catch (e) {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEY) || '';
    }
}

const getAiModel = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AI_MODEL || 'aiModel');
        if (!stored) return GEMINI_MODELS.FLASH;
        const parsed = JSON.parse(stored);
        return parsed || GEMINI_MODELS.FLASH;
    } catch (e) {
        return GEMINI_MODELS.FLASH;
    }
}

export const generateStyleAdvice = async (userProfile, inventory, chatHistory, weatherData = null) => {
    const apiKey = getApiKey();
    const model = getAiModel();

    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in Settings.");
    }

    // Safety check for inventory
    if (!Array.isArray(inventory)) {
        console.warn("Inventory is not an array, defaulting to empty list.", inventory);
        inventory = [];
    }

    // Filter for clean items only
    const cleanInventory = inventory.filter(item => item.isClean);

    const weatherInfo = weatherData ? `${weatherData.temp}°F - ${weatherData.condition}` : "Not available";

    let basePrompt = userProfile.customPersona && userProfile.customPersona.trim() !== ""
        ? userProfile.customPersona
        : SYSTEM_PROMPTS.BASE;

    let systemPrompt = basePrompt
        .replace('{name}', userProfile.name || 'User')
        .replace('{fitPreference}', userProfile.fitPreference || 'Standard')
        .replace('{colorPalette}', userProfile.colorPalette || 'Any')
        .replace('{utilityVsAesthetic}', userProfile.utilityVsAesthetic || 'Balanced')
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
            `${API_ENDPOINTS.GEMINI_BASE}${model}:generateContent?key=${apiKey}`,
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
            const errorData = await response.json().catch(() => ({}));
            const status = response.status;

            if (status === 404) {
                throw new Error(`Model ${model} not found or not supported by your key.`);
            }

            if (status === 429) {
                throw new Error("Quota exceeded. Please check your API usage or try again later.");
            }

            throw new Error(errorData.error?.message || `Gemini API Error: ${status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

export const testApiKeyConnection = async (apiKey, model = "gemini-1.5-flash") => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GEMINI_BASE}${model}:generateContent?key=${apiKey}`, {
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
            const status = response.status;
            if (status === 400) throw new Error("Invalid API Key format or bad request.");
            if (status === 403) throw new Error("API Key not authorized (check valid/billing).");
            if (status === 404) throw new Error(`Model ${model} not available.`);
            if (status === 429) throw new Error("Rate limit exceeded.");

            throw new Error(data.error?.message || `Error: ${response.status} ${response.statusText}`);
        }

        return true;
    } catch (error) {
        throw error;
    }
};
