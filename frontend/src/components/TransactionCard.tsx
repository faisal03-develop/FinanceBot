import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, UserCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income' | 'debt_given' | 'debt_received';
  person: string | null;
  description: string;
  timestamp: any;
}

export const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const isNegative = transaction.type === 'expense' || transaction.type === 'debt_given';
  
  const typeIcons = {
    expense: <ArrowUpRight className="text-rose-400" />,
    income: <ArrowDownLeft className="text-emerald-400" />,
    debt_given: <Wallet className="text-blue-400" />,
    debt_received: <UserCircle className="text-amber-400" />,
  };

  const typeLabels = {
    expense: 'Expense',
    income: 'Income',
    debt_given: 'Money Given',
    debt_received: 'Money Received',
  };

  return (
    <div className="glass-card flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-xl bg-white/5 transition-colors group-hover:bg-white/10",
          isNegative ? "text-rose-400" : "text-emerald-400"
        )}>
          {typeIcons[transaction.type]}
        </div>
        <div>
          <h4 className="font-medium text-white/90">{transaction.description}</h4>
          <p className="text-sm text-white/40 flex items-center gap-1">
            {typeLabels[transaction.type]} {transaction.person && `• ${transaction.person}`}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-semibold text-lg",
          isNegative ? "text-rose-400" : "text-emerald-400"
        )}>
          {isNegative ? '-' : '+'} {transaction.amount.toLocaleString()} <span className="text-xs font-normal opacity-70">{transaction.currency}</span>
        </p>
        <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
          {new Date(transaction.timestamp?.seconds * 1000 || Date.now()).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
