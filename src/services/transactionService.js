const { db, admin } = require('../config/firebase');

async function saveTransaction(data) {
  try {
    const docRef = db.collection('transactions').doc();
    const transaction = {
      id: docRef.id,
      amount: data.amount,
      currency: data.currency || 'PKR',
      type: data.type,
      person: data.person || null,
      description: data.description,
      timestamp: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(transaction);
    return transaction;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw new Error('Database write failed');
  }
}

async function logFailedAttempt(originalInput, reason) {
  try {
    await db.collection('failed_parsing_attempts').add({
      input: originalInput,
      reason: reason,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging failure:', error);
  }
}

module.exports = { saveTransaction, logFailedAttempt };
