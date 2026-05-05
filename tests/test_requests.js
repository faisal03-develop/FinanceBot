const axios = require('axios');

const TEST_CASES = [
  "Maine Ali ko 200 rupay diye",
  "Usman se 500 liye",
  "Aaj 300 ka khana khaya",
  "Ahmed ne mujhe 1000 wapas kiye",
  "Salary credit 50000",
  "Electricity bill 4500 pay kiya",
  "Ali ne mujhse 100 liye",
  "500 rupay",
  "Ali",
  "Maine 100 dollars kharch kiye"
];

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  for (const text of TEST_CASES) {
    try {
      console.log(`Sending: "${text}"`);
      const response = await axios.post('http://localhost:3000/api/transactions/parse', { text });
      console.log(`✅ Success: ${response.data.message}`);
      console.log(`   Extracted:`, JSON.stringify(response.data.data, null, 2));
    } catch (error) {
      if (error.response) {
        console.log(`❌ Failed: ${error.response.data.error}`);
        console.log(`   Guidance: ${error.response.data.guidance || 'N/A'}`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    console.log('-----------------------------------\n');
  }
}

runTests();
