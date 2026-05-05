const { db } = require('../src/config/firebase');

async function testFirestore() {
  try {
    const docRef = db.collection('test').doc('connection');
    await docRef.set({ status: 'connected', timestamp: new Date() });
    const doc = await docRef.get();
    console.log('Firestore Data:', doc.data());
    console.log('✅ Firestore is working');
    process.exit(0);
  } catch (error) {
    console.error('❌ Firestore Error:', error.message);
    process.exit(1);
  }
}

testFirestore();
