'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, RefreshCw, AlertCircle, CheckCircle2, History, PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import { TransactionCard } from '@/components/TransactionCard';

const API_BASE_URL = 'http://localhost:5000/api/transactions';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/parse`, { text: input });
      setMessage({ type: 'success', text: response.data.message });
      setInput('');
      fetchTransactions();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to process request';
      const guidance = error.response?.data?.guidance ? ` - ${error.response.data.guidance}` : '';
      setMessage({ type: 'error', text: `${errorMsg}${guidance}` });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    income: transactions.filter((t: any) => t.type === 'income').reduce((acc, curr: any) => acc + curr.amount, 0),
    expense: transactions.filter((t: any) => t.type === 'expense').reduce((acc, curr: any) => acc + curr.amount, 0),
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Finance <span className="text-blue-500">Bot</span></h1>
          <p className="text-white/40">AI-powered personal finance tracker</p>
        </div>
        <button 
          onClick={fetchTransactions}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card flex items-center gap-5 border-l-4 border-l-emerald-500">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-white/40 font-medium">Total Income</p>
            <p className="text-2xl font-bold text-white tracking-tight">{stats.income.toLocaleString()} <span className="text-sm font-normal opacity-50">PKR</span></p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-5 border-l-4 border-l-rose-500">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-white/40 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-white tracking-tight">{stats.expense.toLocaleString()} <span className="text-sm font-normal opacity-50">PKR</span></p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <section className="mb-12">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Maine Ali ko 200 rupay diye' or 'Lunch for 500'"
            className="input-glass w-full pr-16 py-5 text-lg shadow-2xl group-hover:shadow-blue-500/5"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-90 disabled:bg-white/10 disabled:shadow-none"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-xl flex items-center gap-3 border ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="text-sm font-medium">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Transaction History */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-white/60">
          <History size={18} />
          <h2 className="font-semibold uppercase tracking-widest text-xs">Recent Transactions</h2>
        </div>
        
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((t: any) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                layout
              >
                <TransactionCard transaction={t} />
              </motion.div>
            ))
          ) : (
            <div className="glass-card text-center py-12">
              <p className="text-white/20">No transactions recorded yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
