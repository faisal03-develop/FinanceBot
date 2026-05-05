const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-flash-latest',
        generationConfig: { responseMimeType: 'application/json' }
    });
    const result = await model.generateContent("Extract: I spent 200 PKR on food. Return JSON.");
    const response = await result.response;
    console.log('Gemini Response:', response.text());
    console.log('✅ Gemini Key is valid and model works');
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
  }
}

testGemini();
