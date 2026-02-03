'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportBookingsToCSV } from '../../lib/utils/export'

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_name: string
  service_id: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  price: number
  notes?: string
  created_at: string
}

type SortField = 'date' | 'customer_name' | 'service_name' | 'status' | 'price'
type SortDirection = 'asc' | 'desc'

interface BookingFilters {
  search: string
  status: string
  service: string
  dateFrom: string
  dateTo: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: 'all',
    service: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)


  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [bookings, filters, sortField, sortDirection])

  const loadBookings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/bookings?limit=200')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const json = await res.json()
      const apiBookings = Array.isArray(json.bookings) ? json.bookings : []

      // Map API bookings (with schedules/services join) to UI shape
      const mapped: Booking[] = apiBookings.map((b: any) => {
        const schedule = b.schedules || {}
        const service = schedule.services || {}
        const timeRaw: string = schedule.time || ''
        return {
          id: b.id,
          customer_name: b.user_name || '—',
          customer_email: b.user_email || '',
          customer_phone: b.user_phone || '',
          service_name: service.name_en || service.name_sl || 'Unknown service',
          service_id: service.id || schedule.service_id || 'unknown',
          date: b.booking_date,
          time: timeRaw ? timeRaw.slice(0, 5) : '',
          status: b.status,
          price: typeof service.price === 'number' ? service.price : Number(service.price || 0),
          notes: b.notes || undefined,
          created_at: b.created_at,
        }
      })

      setBookings(mapped)
    } catch (error) {
      console.error('Error loading bookings:', error)
      // Keep current list on error (no mock fallback)
    } finally {
      setIsLoading(false)
    }
  }

  // No mock fallback — admin must use real data

  const applyFiltersAndSort = () => {
    let filtered = [...bookings]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(b =>
        b.customer_name.toLowerCase().includes(searchLower) ||
        b.customer_email.toLowerCase().includes(searchLower) ||
        b.service_name.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status)
    }

    // Apply service filter
    if (filters.service !== 'all') {
      filtered = filtered.filter(b => b.service_id === filters.service)
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(b => b.date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      filtered = filtered.filter(b => b.date <= filters.dateTo)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredBookings(filtered)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      service: 'all',
      dateFrom: '',
      dateTo: ''
    })
  }

  const toggleBookingSelection = (id: string) => {
    const newSelection = new Set(selectedBookings)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedBookings(newSelection)
  }

  const selectAll = () => {
    if (selectedBookings.size === filteredBookings.length) {
      setSelectedBookings(new Set())
    } else {
      setSelectedBookings(new Set(filteredBookings.map(b => b.id)))
    }
  }

  const handleExport = () => {
    const dataToExport = selectedBookings.size > 0
      ? filteredBookings.filter(b => selectedBookings.has(b.id))
      : filteredBookings

    exportBookingsToCSV(dataToExport)
  }

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings?id=${id}` + '', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to update booking')
      }
      // Update local state optimistically
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)))
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status')
    }
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-lime-100 text-lime-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getUniqueServices = () => {
    const services = new Map<string, string>()
    bookings.forEach(b => {
      services.set(b.service_id, b.service_name)
    })
    return Array.from(services.entries())
  }

  const activeFiltersCount = [
    filters.search,
    filters.status !== 'all' ? 1 : 0,
    filters.service !== 'all' ? 1 : 0,
    filters.dateFrom,
    filters.dateTo
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 data-testid="admin-bookings-title" className="text-3xl font-bold text-neutral-900">Bookings</h1>
              <p className="text-sm text-neutral-600 mt-1">
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                {selectedBookings.size > 0 && ` • ${selectedBookings.size} selected`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-lime-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                data-testid="filters-toggle"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>

              <button
                onClick={loadBookings}
                className="p-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Name, email, service..."
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Service
                    </label>
                    <select
                      value={filters.service}
                      onChange={(e) => handleFilterChange('service', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    >
                      <option value="all">All Services</option>
                      {getUniqueServices().map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div data-testid="empty-state" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
            <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No bookings found</h3>
            <p className="text-neutral-600">
              {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'No bookings have been made yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="bookings-table">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 text-lime-500 border-neutral-300 rounded focus:ring-lime-500"
                      />
                    </th>
                    <SortHeader field="date" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                      Date
                    </SortHeader>
                    <SortHeader field="customer_name" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                      Customer
                    </SortHeader>
                    <SortHeader field="service_name" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                      Service
                    </SortHeader>
                    <SortHeader field="status" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                      Status
                    </SortHeader>
                    <SortHeader field="price" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                      Price
                    </SortHeader>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.has(booking.id)}
                          onChange={() => toggleBookingSelection(booking.id)}
                          className="w-4 h-4 text-lime-500 border-neutral-300 rounded focus:ring-lime-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{booking.date}</div>
                        <div className="text-sm text-neutral-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">{booking.customer_name}</div>
                        <div className="text-sm text-neutral-500">{booking.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">{booking.service_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        €{booking.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Confirm"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="text-lime-600 hover:text-lime-900"
                              title="Complete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SortHeader({
  field,
  currentField,
  direction,
  onSort,
  children
}: {
  field: SortField
  currentField: SortField
  direction: SortDirection
  onSort: (field: SortField) => void
  children: React.ReactNode
}) {
  const isActive = currentField === field

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <svg
            className={`w-3 h-3 ${isActive && direction === 'asc' ? 'text-lime-500' : 'text-neutral-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
          </svg>
          <svg
            className={`w-3 h-3 -mt-1 ${isActive && direction === 'desc' ? 'text-lime-500' : 'text-neutral-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
          </svg>
        </div>
      </div>
    </th>
  )
}
