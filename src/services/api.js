import OpenAI from "openai";

export const getOpenAIClient = () => {
    const baseURL = "https://router.huggingface.co/v1";
    const apiKey = import.meta.env.VITE_HF_TOKEN || "YOUR_HF_TOKEN";

    const client = new OpenAI({
        baseURL,
        apiKey,
        dangerouslyAllowBrowser: true // Required for client-side use
    });

    return client;
};

const MODEL_ALIASES = {
    "GPT-OSS (GROQ)": "openai/gpt-oss-120b:groq",
    "Qwen 3.5": "Qwen/Qwen3.5-35B-A3B:novita",
    "Kimi-K2.5": "moonshotai/Kimi-K2.5:novita"
};

export const chatCompletion = async (messages, activeModelAlias) => {
    const client = getOpenAIClient();
    const actualModel = MODEL_ALIASES[activeModelAlias] || activeModelAlias;

    try {
        const response = await client.chat.completions.create({
            model: actualModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
};
