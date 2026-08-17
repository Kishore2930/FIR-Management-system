import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyCw4TtVhEMbCwJnFvbgSkx-p95TN8BShS0";

async function main() {
    try {
        const ai = new GoogleGenAI({ apiKey });
        console.log("Testing listModels...");
        const models = await ai.models.list();
        console.log("Models:", models);

        console.log("\nTesting generation with gemini-1.5-flash...");
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "hello",
        });
        console.log(response.text);
    } catch (error) {
        console.log("Error:", error);
    }
}

main();
