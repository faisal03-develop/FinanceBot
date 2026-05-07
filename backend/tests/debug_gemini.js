const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log('Gemini Response:', response.text());
    console.log('✅ Gemini Key is valid');
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
  }
}

testGemini();
