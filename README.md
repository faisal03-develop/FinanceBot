# AI-Powered Finance Tracking Bot

This is a production-ready AI-powered finance tracking bot that processes casual natural language input in Urdu, Hinglish, and English, extracts structured financial data using the Gemini API, and persists it to Google Firestore.

## Features
- **Multilingual Support**: Parses Urdu (script/Roman), Hinglish, and English.
- **AI Extraction**: Uses **Gemini Flash Latest** for high-accuracy intent classification and multilingual entity extraction.
- **Structured Storage**: Data is validated via Zod and stored in Google Firestore.
- **Robust Error Handling**: Logs failed parsing attempts and handles ambiguous inputs gracefully.

## Prerequisites
- Node.js (v18 or higher)
- A Google Cloud Project with Firestore enabled.
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and populate it with your credentials:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

### 3. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Enable **Firestore Database** in native mode.
4. Go to **Project Settings > Service Accounts**.
5. Click **Generate New Private Key**.
6. Use the values from the generated JSON file for `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`, and `FIREBASE_PRIVATE_KEY` in your `.env`.

### 4. Running the Server
```bash
npm start
```
For development with auto-reload:
```bash
npm run dev
```

## API Documentation

### Parse Transaction
**Endpoint:** `POST /api/transactions/parse`  
**Body:**
```json
{
  "text": "Maine Ali ko 200 rupay diye"
}
```

**Response (Success):**
```json
{
  "message": "✅ 200 PKR recorded as debt given to Ali",
  "data": {
    "id": "...",
    "amount": 200,
    "currency": "PKR",
    "type": "debt_given",
    "person": "Ali",
    "description": "200 PKR given to Ali",
    "timestamp": "..."
  }
}
```

## Representative Test Cases

| Input | Expected Type | Expected Person |
|-------|---------------|-----------------|
| "Maine Ali ko 200 rupay diye" | `debt_given` | Ali |
| "Usman se 500 liye" | `debt_received` | Usman |
| "Aaj 300 ka khana khaya" | `expense` | null |
| "Ahmed ne mujhe 1000 wapas kiye" | `income` | Ahmed |
| "Salary credit 50000" | `income` | null |
| "Electricity bill 4500 pay kiya" | `expense` | null |
| "Ali ne mujhse 100 liye" | `debt_given` | Ali |
| "500 rupay" | *Rejected* (Ambiguous) | - |
| "Ali" | *Rejected* (No amount) | - |
| "Maine 100 dollars kharch kiye" | `expense` (Currency: USD) | null |

## Troubleshooting & Debugging
If you encounter issues (like `Internal Server Error`), use the included debug scripts to verify your credentials:

- **Test Gemini Key**: `node tests/debug_gemini_v2.js`
- **Test Firestore**: `node tests/debug_firestore.js`
- **List Available Models**: `node tests/list_models_raw.js`

