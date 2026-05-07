# AI Finance Tracking Bot - Full Stack

This project now includes a **Next.js Frontend** and a **Node.js/Express Backend**.

## Project Structure
- `/backend`: Express API with Gemini and Firestore integration.
- `/frontend`: Next.js Dashboard with Chat Interface.
- `/package.json`: Root manager for running both services.

## How to Run

### 1. Prerequisites
- Ensure your `.env` in `/backend` is correctly populated with Gemini and Firebase keys.

### 2. Install All Dependencies
Run this in the root directory:
```bash
npm install && cd backend && npm install && cd ../frontend && npm install
```

### 3. Run Development Server
Run this in the root directory:
```bash
npm run dev
```
This will start:
- **Backend** on [http://localhost:5000](http://localhost:5000)
- **Frontend** on [http://localhost:3000](http://localhost:3000)

## Using the Interface
1. Open [http://localhost:3001](http://localhost:3001).
2. Use the chat bar to type transactions in Urdu, English, or Hinglish.
3. See real-time updates in your history and summary cards.
