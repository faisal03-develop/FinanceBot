const geminiModel = require('../config/gemini');
const groq = require('../config/groq');

const EXTRACTION_PROMPT = `
You are a financial data extraction assistant. Your task is to extract structured financial information from informal natural language input in Urdu (script or Roman), Hinglish, or English.

### Data Schema:
- amount: (number, required) The numerical value of the transaction.
- currency: (string) Default "PKR". Infer from text if mentioned (e.g., "$", "dollar", "euro").
- type: (string) Must be one of: "expense", "income", "debt_given", "debt_received".
- person: (string or null) The name of the person involved in income or debt scenarios.
- description: (string) A concise summary of the transaction.
- confidence: (number 0-1) Your confidence score in this extraction.

### Classification Rules:
- "diye", "udhaar diye", "gave to" -> "debt_given" (if a person is mentioned).
- "liye", "udhaar liye", "borrowed from", "received from" -> "debt_received" (if a person is mentioned).
- "khaya", "kharida", "spent", "bill bhara" -> "expense".
- "salary", "milay", "kamaye", "earned" -> "income".
- If a person "wapas kiye" (returned) money to the user, it is "income" from that person.
- If the user "wapas kiye" (returned) money to someone, it is an "expense" (settling debt).

### Handling Ambiguity:
- If the amount is missing, return an error object.
- If the intent is genuinely unclear (e.g., "500 rupay"), set a low confidence score and explain why in a 'notes' field.
- Extraction MUST be in valid JSON format.

Input: {input}
`;

async function extractTransactionData(userInput, botType = 'gemini') {
  try {
    const prompt = EXTRACTION_PROMPT.replace('{input}', userInput);
    let text;

    if (botType === 'groq') {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });
      text = completion.choices[0].message.content;
    } else {
      // Default to Gemini
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error in ${botType} extraction:`, error);
    throw new Error('Failed to parse transaction data');
  }
}

module.exports = { extractTransactionData };
