'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Customer {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  idNumber: string
  idType: string
  idImageUrl: string | null
  bankStatementUrl: string | null
  status: string
  trustScore: number | null
  trustScoreDetails: string | null
  createdAt: string
}

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const statusOptions = ['New Lead', 'Contacted', 'Documents Verified', 'Approved', 'Rejected', 'On Hold']

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const updateCustomerStatus = async (customerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Update local state
        setCustomers(customers.map(c => 
          c.id === customerId ? { ...c, status: newStatus } : c
        ))
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer({ ...selectedCustomer, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from local state
        setCustomers(customers.filter(c => c.id !== customerId))
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(null)
        }
        alert('Customer deleted successfully')
      } else {
        alert('Failed to delete customer')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Error deleting customer')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New Lead': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-purple-100 text-purple-800',
      'Documents Verified': 'bg-green-100 text-green-800',
      'Approved': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredCustomers = statusFilter === 'All' 
    ? customers 
    : customers.filter(c => c.status === statusFilter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all customer registrations</p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{customers.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">With ID Photos</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.idImageUrl).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">With Bank Statements</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.bankStatementUrl).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'All'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({customers.length})
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({customers.filter(c => c.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-xl font-bold text-gray-900">All Customers</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No customers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trust Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Added {formatDate(customer.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {customer.trustScore !== null && customer.trustScore !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="relative w-12 h-12">
                              <svg className="w-12 h-12 transform -rotate-90">
                                <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  stroke={customer.trustScore >= 70 ? '#10b981' : customer.trustScore >= 40 ? '#f59e0b' : '#ef4444'}
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={`${(customer.trustScore / 100) * 125.6} 125.6`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xs font-bold ${customer.trustScore >= 70 ? 'text-green-600' : customer.trustScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {customer.trustScore}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {customer.trustScore >= 70 ? 'Excellent' : customer.trustScore >= 40 ? 'Fair' : 'Poor'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not analyzed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {customer.idType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customer.idNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customer.dateOfBirth || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {customer.idImageUrl && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                              ID ✓
                            </span>
                          )}
                          {customer.bankStatementUrl && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                              Bank ✓
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                            title="Delete customer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <p className="text-blue-100 mt-1">Customer Details</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>

                {/* Status Update */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                  <select
                    value={selectedCustomer.status}
                    onChange={(e) => updateCustomerStatus(selectedCustomer.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">Current status: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedCustomer.status)}`}>{selectedCustomer.status}</span></p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">First Name</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.firstName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Last Name</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.lastName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">ID Number</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.idNumber || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">ID Type</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.idType}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Registration Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(selectedCustomer.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Trust Score Section */}
              {selectedCustomer.trustScore !== null && selectedCustomer.trustScore !== undefined && (
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    AI Trust Score Analysis
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={selectedCustomer.trustScore >= 70 ? '#10b981' : selectedCustomer.trustScore >= 40 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(selectedCustomer.trustScore / 100) * 251.2} 251.2`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-3xl font-bold ${selectedCustomer.trustScore >= 70 ? 'text-green-600' : selectedCustomer.trustScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {selectedCustomer.trustScore}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-2xl font-bold mb-2 ${selectedCustomer.trustScore >= 70 ? 'text-green-700' : selectedCustomer.trustScore >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>
                          {selectedCustomer.trustScore >= 70 ? 'Excellent' : selectedCustomer.trustScore >= 40 ? 'Fair' : 'Poor'} Trust Score
                        </p>
                        {selectedCustomer.trustScoreDetails && (
                          <div className="text-sm text-gray-700 space-y-1">
                            {(() => {
                              try {
                                const details = JSON.parse(selectedCustomer.trustScoreDetails)
                                return (
                                  <>
                                    <p><strong>Account Balance:</strong> {details.accountBalance}</p>
                                    <p><strong>Transaction Regularity:</strong> {details.transactionRegularity}</p>
                                    <p><strong>Income Stability:</strong> {details.incomeStability}</p>
                                    <p><strong>Expense Management:</strong> {details.expenseManagement}</p>
                                    <p className="pt-2 mt-2 border-t border-blue-200"><em>{details.recommendation}</em></p>
                                  </>
                                )
                              } catch {
                                return <p className="text-gray-500">Details not available</p>
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* ID Image */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">ID Document</h5>
                    {selectedCustomer.idImageUrl ? (
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={selectedCustomer.idImageUrl}
                          alt="ID Document"
                          className="w-full h-auto"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        <p className="text-gray-500">No ID image uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Bank Statement */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Bank Statement</h5>
                    {selectedCustomer.bankStatementUrl ? (
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={selectedCustomer.bankStatementUrl}
                          alt="Bank Statement"
                          className="w-full h-auto"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">No bank statement uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-3xl border-t border-gray-200 flex gap-3">
              <button
                onClick={() => deleteCustomer(selectedCustomer.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Customer
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
