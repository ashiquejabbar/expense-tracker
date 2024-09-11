import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchTransactions, addTransaction } from '../services/transactionService'
import { generateAIReport } from '../services/AIService'
import TransactionTable from '../components/TransactionTable'
import { Filter, Transaction } from '../types/types'
import AddTransactionForm from '../components/AddTransactionForm'
import { Menu, Transition, Dialog } from '@headlessui/react'
import { ChartBarIcon, LogOut as Log } from 'lucide-react';
import Markdown from "react-markdown";

// import { XIcon, ChartBarIcon } from '@heroicons/react/outline'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingAIReport, setLoadingAIReport] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [showAIReport, setShowAIReport] = useState(false)
  const [typedReport, setTypedReport] = useState('')

  const loadTransactions = useCallback(async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const fetchedTransactions = await fetchTransactions(user.uid, filter)
      setTransactions(fetchedTransactions)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }, [user, navigate, filter])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      setError("Failed to log out. Please try again.")
    }
  }

  const handleAddTransaction = async (data: any) => {
    if (!user) return

    try {
      await addTransaction(user.uid, data)
      setShowAddForm(false)
      loadTransactions()
    } catch (err) {
      console.error("Error adding transaction:", err)
      setError(`Failed to add transaction: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  const handleAIReports = async () => {
    if (!user || transactions.length === 0) return

    setLoadingAIReport(true)

    try {
      const report = await generateAIReport(transactions)

      setShowAIReport(true)
      startTypingEffect(report)
    } catch (err) {
      console.error("Error generating AI report:", err)
      setError(`Failed to generate AI report: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoadingAIReport(false)
    }
  }

  const startTypingEffect = (text: string) => {
    let index = 0
    setTypedReport('')

    const typingInterval = setInterval(() => {
      setTypedReport((prev) => prev + text[index])
      index += 1

      if (index >= text.length) {
        clearInterval(typingInterval)
      }
    }, 50)
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Tracker</h1>
            </div>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center items-center rounded-full border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user?.photoURL || 'https://via.placeholder.com/40'}
                      alt="User avatar"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-72 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
                    <div className="px-4 py-3">
                      <div className='flex items-center space-x-3'>
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user?.photoURL || 'https://via.placeholder.com/40'}
                          alt="User avatar"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex w-full px-4 py-2 text-sm leading-5 text-left`}
                          >
                            <Log className='mr-2' />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-fadeIn" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div className="bg-white shadow-md rounded-lg p-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label htmlFor="filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="border-gray-300 rounded-md shadow-sm text-sm flex-grow sm:flex-grow-0"
              >
                <option value="all">All</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex-grow sm:flex-grow-0 text-sm"
              >

                Add Transaction
              </button>
              <button
                onClick={handleAIReports}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex-grow sm:flex-grow-0 text-sm flex items-center justify-center"

              >
                {loadingAIReport ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="text-white" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="text-gray-400" fill="currentColor" d="M4 12a8 8 0 01.3-2.9l-1.7-1a10 10 0 00-.5 3.9zM20.7 4a8 8 0 01-.3 2.9l1.7 1a10 10 0 00.5-3.9zM12 4a8 8 0 01-2.9.3l-1-1.7a10 10 0 003.9-.5zM4.3 20a8 8 0 012.9-.3l1 1.7a10 10 0 00-3.9.5z"></path>
                    </svg>
                    <span>AI Reports</span>
                  </>
                )

                  : (

                    <>
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      AI Reports
                    </>
                  )}
              </button>

            </div>
          </div>

          <TransactionTable transactions={transactions} isLoading={loading} />
        </div>

        {showAddForm && (
          <div className="mt-6 bg-white shadow-md rounded-lg p-6 animate-slideDown">
            <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
            <AddTransactionForm
              onSubmit={handleAddTransaction}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
      <Dialog
  open={showAIReport}
  onClose={() => setShowAIReport(false)}
  className="relative z-50"
>
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white p-6 "> {/* Set max-height and enable scrollbar */}
      <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
        AI Report
      </Dialog.Title>
      <div className="mt-2  max-h-[60vh] overflow-y-auto">
        <p className="text-sm text-gray-500">
          <Markdown className="text-sm text-gray-700 font-semibold whitespace-pre-wrap">
            {typedReport}
          </Markdown>
        </p>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => setShowAIReport(false)}
        >
          Close
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


      </main>
    </div>
  )
}