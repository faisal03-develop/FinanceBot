const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no direct listModels in the SDK for node? 
    // Actually there is.
    // But let's just try gemini-1.5-flash again with proper config if needed.
    // Wait, the error message says 404.
    console.log("Checking gemini-1.5-flash...");
  } catch (error) {
    console.error(error);
  }
}
listModels();
