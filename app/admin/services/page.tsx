'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Service } from '../../types/service'
import { formatPrice } from '../../../lib/utils/helpers'
import { bulkSoftDelete } from '../../lib/utils/crud'
import { exportServicesToCSV } from '../../lib/utils/export'
import BulkEditModal from '../../components/admin/BulkEditModal'
import { createClient } from '@supabase/supabase-js'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [showBulkEdit, setShowBulkEdit] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Service deleted!')
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const toggleServiceSelection = (id: string) => {
    const newSelection = new Set(selectedServices)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedServices(newSelection)
  }

  const selectAll = () => {
    if (selectedServices.size === filteredServices.length) {
      setSelectedServices(new Set())
    } else {
      setSelectedServices(new Set(filteredServices.map(s => s.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedServices.size === 0) return
    if (!confirm(`Delete ${selectedServices.size} selected service(s)?`)) return

    try {
      const result = await bulkSoftDelete('services', Array.from(selectedServices))
      if (result.success) {
        alert(`${result.deleted} service(s) deleted!`)
        setSelectedServices(new Set())
        fetchServices()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      alert('Failed to delete services')
    }
  }

  const handleExport = () => {
    const dataToExport = selectedServices.size > 0
      ? services.filter(s => selectedServices.has(s.id))
      : filteredServices
    
    exportServicesToCSV(dataToExport)
  }

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category === filter)

  const bulkEditFields = [
    { key: 'price', label: 'Price (€)', type: 'number' as const },
    { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number' as const },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' }
      ]
    },
    { key: 'featured', label: 'Featured', type: 'checkbox' as const, placeholder: 'Mark as featured' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-[#A4B82C] hover:text-[#8A9824] text-sm font-medium mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-neutral-900">Services Management</h1>
              <p className="text-sm text-neutral-600 mt-1">Manage wellness services and packages</p>
            </div>
            <Link
              href="/admin/services/new"
              className="bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              + Add New Service
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bulk Actions Toolbar */}
        {selectedServices.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-neutral-700">
              {selectedServices.size} service(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkEdit(true)}
                className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Bulk Edit
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {['all', 'Yoga', 'Ice Bathing', 'Workshops', 'Packages'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === cat
                    ? 'bg-[#A4B82C] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#A4B82C] border-t-transparent" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-neutral-600 mb-4">No services found</p>
            <Link
              href="/admin/services/new"
              className="inline-block bg-[#A4B82C] hover:bg-[#8A9824] text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Create Your First Service
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedServices.size === filteredServices.length && filteredServices.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 text-[#A4B82C] border-neutral-300 rounded focus:ring-[#A4B82C]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredServices.map((service) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedServices.has(service.id)}
                        onChange={() => toggleServiceSelection(service.id)}
                        className="w-4 h-4 text-[#A4B82C] border-neutral-300 rounded focus:ring-[#A4B82C]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {service.image_url && (
                          <img
                            src={service.image_url}
                            alt={service.name_en}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {service.name_en}
                          </div>
                          <div className="text-sm text-neutral-500 truncate max-w-xs">
                            {service.description_en}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {formatPrice(service.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {service.duration ? `${service.duration} min` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {service.capacity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/services/edit/${service.id}`}
                        className="text-[#A4B82C] hover:text-[#8A9824] mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        table="services"
        selectedIds={Array.from(selectedServices)}
        fields={bulkEditFields}
        onSuccess={() => {
          setSelectedServices(new Set())
          fetchServices()
        }}
      />
    </div>
  )
}
