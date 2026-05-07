const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Try a common model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash");
    } catch (e) {
        console.log("Error with gemini-1.5-flash:", e.message);
        
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            await model.generateContent("test");
            console.log("Success with gemini-pro");
        } catch (e2) {
            console.log("Error with gemini-pro:", e2.message);
        }
    }
}
test();
