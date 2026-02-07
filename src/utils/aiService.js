import { API_ENDPOINTS, SYSTEM_PROMPTS, LOCAL_STORAGE_KEYS, GEMINI_MODELS, AI_PROVIDERS } from './constants';

const getSettings = () => {
    try {
        const apiKey = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEY) || '""') || localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEY) || '';
        const provider = JSON.parse(localStorage.getItem('aiProvider') || `"${AI_PROVIDERS.GOOGLE}"`);
        const model = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AI_MODEL || 'aiModel') || `"${GEMINI_MODELS.FLASH_2}"`);
        return { apiKey, provider, model };
    } catch (e) {
        return { apiKey: '', provider: AI_PROVIDERS.GOOGLE, model: GEMINI_MODELS.FLASH_2 };
    }
}

export const generateStyleAdvice = async (userProfile, inventory, chatHistory, weatherData = null) => {
    const { apiKey, provider, model } = getSettings();

    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in Settings.");
    }

    // Safety check for inventory
    let cleanInventory = [];
    if (Array.isArray(inventory)) {
        cleanInventory = inventory.filter(item => item.isClean);
    } else {
        console.warn("Inventory is not an array, defaulting to empty list.", inventory);
    }

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

    // Check last msg for image (Critique Mode)
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg && lastMsg.image) {
        systemPrompt += SYSTEM_PROMPTS.CRITIQUE_MODE;
    }

    // Check for Sass Mode
    if (userProfile.sassMode) {
        systemPrompt += SYSTEM_PROMPTS.SASS_MODE;
    }

    try {
        if (provider === AI_PROVIDERS.OPENAI) {
            // OpenAI Format
            const messages = [
                { role: "system", content: systemPrompt },
                ...chatHistory.map(msg => {
                    if (msg.image) {
                        return {
                            role: msg.sender === 'ai' ? 'assistant' : 'user',
                            content: [
                                { type: "text", text: msg.text },
                                { type: "image_url", image_url: { url: msg.image } }
                            ]
                        };
                    }
                    return {
                        role: msg.sender === 'ai' ? 'assistant' : 'user',
                        content: msg.text
                    };
                })
            ];

            const response = await fetch(API_ENDPOINTS.OPENAI_COMPLETIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o", // Defaulting to 4o for now as it's versatile
                    messages: messages,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || `OpenAI Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } else if (provider === AI_PROVIDERS.ANTHROPIC) {
            // Anthropic Format (System prompt is separate)
            const messages = chatHistory.map(msg => {
                if (msg.image) {
                    // Anthropic expects base64 without header for some endpoints or specific format
                    // For 'messages' endpoint:
                    const [header, base64Data] = msg.image.split(',');
                    const mediaType = header.match(/:(.*?);/)[1];
                    return {
                        role: msg.sender === 'ai' ? 'assistant' : 'user',
                        content: [
                            { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
                            { type: "text", text: msg.text }
                        ]
                    };
                }
                return {
                    role: msg.sender === 'ai' ? 'assistant' : 'user',
                    content: msg.text
                };
            });

            const response = await fetch(API_ENDPOINTS.ANTHROPIC_MESSAGES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20240620",
                    system: systemPrompt,
                    messages: messages,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || `Anthropic Error: ${response.status}`);
            }

            const data = await response.json();
            return data.content[0].text;

        } else {
            // Default: Google Gemini
            const contents = [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                ...chatHistory.map(msg => {
                    const parts = [{ text: msg.text }];
                    if (msg.image) {
                        const [header, data] = msg.image.split(',');
                        const mimeType = header.match(/:(.*?);/)[1];
                        parts.push({
                            inline_data: { mime_type: mimeType, data: data }
                        });
                    }
                    return {
                        role: msg.sender === 'ai' ? 'model' : 'user',
                        parts: parts
                    };
                })
            ];

            const response = await fetch(
                `${API_ENDPOINTS.GEMINI_BASE}${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: contents,
                        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const status = response.status;
                if (status === 404) throw new Error(`Model ${model} not found.`);
                if (status === 429) throw new Error("Google Rate limit exceeded. Try again in 60s.");
                throw new Error(errorData.error?.message || `Gemini API Error: ${status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

export const testApiKeyConnection = async (apiKey, model, provider = AI_PROVIDERS.GOOGLE) => {
    try {
        if (provider === AI_PROVIDERS.OPENAI) {
            const response = await fetch(API_ENDPOINTS.OPENAI_COMPLETIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5
                })
            });
            if (!response.ok) throw new Error(`OpenAI Connection Failed: ${response.status}`);
            return true;
        }

        if (provider === AI_PROVIDERS.ANTHROPIC) {
            // Note: Anthropic might require a proxy due to CORS if run purely client-side without Vite proxy or similar.
            // But we will try direct call as per user context usually allowing this from localhost.
            const response = await fetch(API_ENDPOINTS.ANTHROPIC_MESSAGES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 5,
                    messages: [{ role: "user", content: "Hello" }]
                })
            });
            if (!response.ok) throw new Error(`Anthropic Connection Failed: ${response.status}`);
            return true;
        }

        // Google
        const response = await fetch(`${API_ENDPOINTS.GEMINI_BASE}${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        if (!response.ok) {
            const status = response.status;
            if (status === 400) throw new Error("Invalid API Key format.");
            if (status === 403) throw new Error("API Key not authorized.");
            if (status === 404) throw new Error(`Model ${model} not available.`);
            if (status === 429) throw new Error("Rate limit exceeded.");
            throw new Error(`Error: ${response.status}`);
        }
        return true;

    } catch (error) {
        throw error;
    }
};
