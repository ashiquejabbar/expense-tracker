import { Timestamp } from "firebase/firestore";

// types.ts
export type TransactionType = 'expense' | 'income';

export interface  Transaction {
    id: string;
    date: Date | Timestamp;
    type: 'expense' | 'income';
    category: string;
    amount: number;
  }

 export type TransactionFormData = Omit<Transaction, 'id'>;
export type Filter = 'all' | 'day' | 'week' | 'month';
