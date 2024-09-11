import { collection, query, where, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Filter, Transaction } from '../types/types';

export const fetchTransactions = async (userId: string, filter: Filter): Promise<Transaction[]> => {
  const transactionsRef = collection(db, 'transactions');
  let q = query(transactionsRef, where('userId', '==', userId), orderBy('date', 'desc'));

  // Apply date filter if not 'all'
  if (filter !== 'all') {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(); // End of the range

    switch (filter) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of the week
        break;
      case 'month':
        startDate = new Date(now.setDate(1)); // Start of the month
        endDate = new Date(now.setMonth(now.getMonth() + 1, 0)); // End of the month
        break;
      default:
        throw new Error('Invalid filter');
    }

    // Convert startDate and endDate to Timestamps
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    q = query(q, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
      type: data.type,
      category: data.category,
      amount: data.amount
    } as Transaction;
  });
};

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id'>): Promise<void> => {
  const transactionsRef = collection(db, 'transactions');
  await addDoc(transactionsRef, {
    ...transaction,
    userId,
    //@ts-ignore
    date: transaction.date instanceof Date ? Timestamp.fromDate(transaction.date) : Timestamp.fromDate(new Date(transaction.date))
  });
};
