
import { format } from 'date-fns'
import { Transaction } from '../types/types'
import { toDate } from '../Utility'
import { ArrowDown, ArrowUp } from 'lucide-react'


interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
}

export default function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white shadow-md rounded-lg">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {format(toDate(transaction.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span
                  className={`inline-flex items-center ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUp className=" mr-1" />
                  ) : (
                    <ArrowDown className=" mr-1" />
                  )}
                  ${transaction.amount.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg animate-pulse">
      <div className="h-16 bg-gray-200 rounded-t-lg"></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center h-16 space-x-4 px-6 border-b border-gray-200">
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
}