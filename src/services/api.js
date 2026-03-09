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

const ROUTER_SERVER_URL = "http://localhost:8000";

export const chatCompletion = async (messages, activeModelAlias, onChunk) => {
    // If Arch-Router is selected, use the local Python server
    if (activeModelAlias === "Arch-Router (Auto)") {
        try {
            const response = await fetch(`${ROUTER_SERVER_URL}/api/chat_stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || `Router server error: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullText = "";
            let metadataPrefix = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.type === 'metadata') {
                                metadataPrefix = `> 🔀 Routed to **${data.routed_display_name}** (category: \`${data.route}\`)\n\n`;
                                fullText = metadataPrefix;
                                if (onChunk) onChunk(fullText);
                            } else if (data.type === 'chunk') {
                                fullText += data.content;
                                if (onChunk) onChunk(fullText);
                            } else if (data.type === 'error') {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            // Incomplete JSON chunk or other parse error, ignore and continue reading
                        }
                    }
                }
            }

            return fullText;
        } catch (error) {
            if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                throw new Error("Cannot connect to Arch-Router server. Make sure to start it with: cd server && python router_server.py");
            }
            throw error;
        }
    }

    // Default: use HuggingFace API directly
    const client = getOpenAIClient();
    const actualModel = MODEL_ALIASES[activeModelAlias] || activeModelAlias;

    try {
        const response = await client.chat.completions.create({
            model: actualModel,
            messages: messages,
            temperature: 0.7,
            stream: true,
        });

        let fullText = "";
        for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                fullText += content;
                if (onChunk) onChunk(fullText);
            }
        }

        return fullText;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
};

