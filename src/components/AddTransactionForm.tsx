
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Transaction } from '../types/types';
import { formatDate } from '../Utility';

const transactionSchema = yup.object().shape({
  date: yup.date().required('Date is required').typeError('Invalid date format'),
  type: yup.string().oneOf(['expense', 'income'] as const, 'Invalid type').required('Type is required'),
  category: yup.string().required('Category is required'),
  amount: yup.number().positive('Amount must be a positive number').required('Amount is required'),
});

export type TransactionFormData = Omit<Transaction, 'id'>;

interface AddTransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

const incomeTypes = ['Salary', 'Bonus', 'Investment', 'Rental Income', 'Other'];
const expenseTypes = ['Rent', 'Food', 'Travel', 'Cosmetics', 'Bills', 'Other'];

export default function AddTransactionForm({ onSubmit, onCancel }: AddTransactionFormProps) {
  const { control, handleSubmit, watch, formState: { errors, isSubmitting },  } = useForm<TransactionFormData>({
    // @ts-ignore
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      type: 'expense',
      category: '',
      amount: 0,
    }
  });

  const transactionType = watch('type');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Transaction</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  value={formatDate(field.value)}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select {...field} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              )}
            />
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select {...field} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="">Select a category</option>
                  {(transactionType === 'income' ? incomeTypes : expenseTypes).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${isSubmitting ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V1M12 23v-3M4 12H1M23 12h-3M4.22 4.22l-2.12-2.12M20.48 20.48l-2.12-2.12M20.48 4.22l-2.12 2.12M4.22 20.48l-2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Saving...
                </div>
              ) : 'Save'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}