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

async function getRecentTransactions(limit = 10) {
  try {
    const snapshot = await db.collection('transactions')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Database read failed');
  }
}

module.exports = { saveTransaction, logFailedAttempt, getRecentTransactions };

