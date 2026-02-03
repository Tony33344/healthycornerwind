 'use client'

/**
 * CSV Export Utilities
 * Functions for exporting data to CSV format
 */

/**
 * Convert an array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  columns?: Array<{ key: keyof T; label: string }>
): string {
  if (data.length === 0) return ''

  // If columns not specified, use all keys from first object
  const cols = columns || Object.keys(data[0]).map(key => ({
    key: key as keyof T,
    label: key
  }))

  // Create header row
  const headers = cols.map(col => escapeCSVValue(col.label))
  const headerRow = headers.join(',')

  // Create data rows
  const dataRows = data.map(row => {
    const values = cols.map(col => {
      const value = row[col.key]
      return escapeCSVValue(formatValue(value))
    })
    return values.join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: string): string {
  if (value == null) return ''
  
  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Format value for CSV output
 */
function formatValue(value: any): string {
  if (value == null) return ''
  
  // Handle dates
  if (value instanceof Date) {
    return value.toISOString()
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.join('; ')
  }
  
  // Handle objects
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(
  data: string,
  filename: string = 'export.csv'
): void {
  // Ensure filename has .csv extension
  if (!filename.endsWith('.csv')) {
    filename += '.csv'
  }

  // Create blob
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Export array of objects to CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv',
  columns?: Array<{ key: keyof T; label: string }>
): void {
  const csv = arrayToCSV(data, columns)
  downloadCSV(csv, filename)
}

/**
 * Export bookings to CSV
 */
export function exportBookingsToCSV(
  bookings: Array<{
    id: string | number
    customer_name?: string
    customer_email?: string
    service_name?: string
    date?: string
    time?: string
    status?: string
    price?: number
    created_at?: string
  }>,
  filename: string = 'bookings-export.csv'
): void {
  const columns = [
    { key: 'id' as const, label: 'Booking ID' },
    { key: 'customer_name' as const, label: 'Customer Name' },
    { key: 'customer_email' as const, label: 'Email' },
    { key: 'service_name' as const, label: 'Service' },
    { key: 'date' as const, label: 'Date' },
    { key: 'time' as const, label: 'Time' },
    { key: 'status' as const, label: 'Status' },
    { key: 'price' as const, label: 'Price (€)' },
    { key: 'created_at' as const, label: 'Booked At' }
  ]

  exportToCSV(bookings, filename, columns)
}

/**
 * Export services to CSV
 */
export function exportServicesToCSV(
  services: Array<{
    id: string | number
    name_en?: string
    category?: string
    price?: number
    duration_minutes?: number
    status?: string
    featured?: boolean
    created_at?: string
  }>,
  filename: string = 'services-export.csv'
): void {
  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'name_en' as const, label: 'Name' },
    { key: 'category' as const, label: 'Category' },
    { key: 'price' as const, label: 'Price (€)' },
    { key: 'duration_minutes' as const, label: 'Duration (min)' },
    { key: 'status' as const, label: 'Status' },
    { key: 'featured' as const, label: 'Featured' },
    { key: 'created_at' as const, label: 'Created At' }
  ]

  exportToCSV(services, filename, columns)
}

/**
 * Export menu items to CSV
 */
export function exportMenuToCSV(
  menuItems: Array<{
    id: string | number
    name_en?: string
    category?: string
    price?: number
    calories?: number
    dietary_info?: string[]
    allergens?: string[]
    available?: boolean
    status?: string
    created_at?: string
  }>,
  filename: string = 'menu-export.csv'
): void {
  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'name_en' as const, label: 'Name' },
    { key: 'category' as const, label: 'Category' },
    { key: 'price' as const, label: 'Price (€)' },
    { key: 'calories' as const, label: 'Calories' },
    { key: 'dietary_info' as const, label: 'Dietary Info' },
    { key: 'allergens' as const, label: 'Allergens' },
    { key: 'available' as const, label: 'Available' },
    { key: 'status' as const, label: 'Status' },
    { key: 'created_at' as const, label: 'Created At' }
  ]

  exportToCSV(menuItems, filename, columns)
}

/**
 * Export generic data with timestamp in filename
 */
export function exportWithTimestamp<T extends Record<string, any>>(
  data: T[],
  baseFilename: string,
  columns?: Array<{ key: keyof T; label: string }>
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const filename = `${baseFilename}-${timestamp}.csv`
  exportToCSV(data, filename, columns)
}
