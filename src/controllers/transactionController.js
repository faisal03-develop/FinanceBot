const { extractTransactionData } = require('../services/extractionService');
const { saveTransaction, logFailedAttempt } = require('../services/transactionService');
const { validateExtractedData } = require('../utils/validator');

async function processTransaction(req, res) {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Input text is too long' });
  }

  try {
    // 1. Extract data using Gemini
    const extracted = await extractTransactionData(text);

    // 2. Validate extracted data
    const validation = validateExtractedData(extracted);

    if (!validation.success) {
      const errorMsg = validation.error.issues.map(i => i.message).join(', ');
      await logFailedAttempt(text, `Validation failed: ${errorMsg}`);
      return res.status(422).json({
        error: 'Could not reliably parse the transaction',
        details: validation.error.issues,
        guidance: 'Please specify the amount and whether it was an expense, income, or debt.'
      });
    }

    // 3. Handle low confidence or ambiguity
    if (extracted.confidence && extracted.confidence < 0.6) {
      await logFailedAttempt(text, `Low confidence: ${extracted.confidence}`);
      return res.status(422).json({
        error: 'Input is too ambiguous',
        guidance: 'I am not sure if this is an expense or debt. Could you please clarify?'
      });
    }

    // 4. Save to Firestore
    const saved = await saveTransaction(validation.data);

    // 5. Send confirmation
    let confirmationMsg = `✅ ${saved.amount} ${saved.currency} recorded as ${saved.type.replace('_', ' ')}`;
    if (saved.person) {
      confirmationMsg += ` ${saved.type.includes('given') ? 'to' : 'from'} ${saved.person}`;
    }

    res.status(201).json({
      message: confirmationMsg,
      data: saved
    });

  } catch (error) {
    console.error('Processing error:', error);
    await logFailedAttempt(text, error.message);
    res.status(500).json({ error: 'An internal error occurred while processing your request' });
  }
}

module.exports = { processTransaction };
