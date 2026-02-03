import { 
  createEmptyCart,
  generateCartId,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity
} from '../../app/lib/utils/cart'
import { 
  generateOrderNumber
} from '../../app/lib/utils/order'
import { 
  arrayToCSV,
  downloadCSV,
  exportBookingsToCSV,
  exportServicesToCSV,
  exportMenuToCSV
} from '../../app/lib/utils/export'

describe('Cart Utilities', () => {
  describe('createEmptyCart', () => {
    it('should create an empty cart with correct structure', () => {
      const cart = createEmptyCart()
      
      expect(cart).toHaveProperty('id')
      expect(cart).toHaveProperty('items')
      expect(cart).toHaveProperty('total_items')
      expect(cart).toHaveProperty('total_price')
      expect(cart).toHaveProperty('created_at')
      expect(cart).toHaveProperty('updated_at')
      expect(cart).toHaveProperty('expires_at')
      
      expect(cart.items).toEqual([])
      expect(cart.total_items).toBe(0)
      expect(cart.total_price).toBe(0)
    })

    it('should generate unique cart IDs', () => {
      const cart1 = createEmptyCart()
      const cart2 = createEmptyCart()
      
      expect(cart1.id).not.toBe(cart2.id)
    })
  })

  describe('generateCartId', () => {
    it('should generate unique cart IDs with correct format', () => {
      const id1 = generateCartId()
      const id2 = generateCartId()
      
      expect(id1).toMatch(/^cart_\d+_[a-z0-9]{9}$/)
      expect(id2).toMatch(/^cart_\d+_[a-z0-9]{9}$/)
      expect(id1).not.toBe(id2)
    })
  })

  describe('addItemToCart', () => {
    it('should add item to empty cart', () => {
      const cart = createEmptyCart()
      const item = {
        menu_item_id: 'service-1',
        name: 'Morning Yoga',
        price: 25.00,
        category: 'service'
      }
      
      const updatedCart = addItemToCart(cart, item)
      
      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0]).toEqual(item)
      expect(updatedCart.total_items).toBe(1)
      expect(updatedCart.total_price).toBe(25.00)
    })

    it('should update quantity for existing item', () => {
      const cart = createEmptyCart()
      const item = {
        menu_item_id: 'service-1',
        name: 'Morning Yoga',
        price: 25.00,
        category: 'service'
      }
      
      const cartWithItem = addItemToCart(cart, item)
      const updatedCart = addItemToCart(cartWithItem, item)
      
      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0].quantity).toBe(3)
      expect(updatedCart.total_items).toBe(3)
      expect(updatedCart.total_price).toBe(75.00)
    })
  })
})

describe('Order Utilities', () => {
  describe('generateOrderNumber', () => {
    it('should generate unique order numbers with correct format', () => {
      const order1 = generateOrderNumber()
      const order2 = generateOrderNumber()
      
      expect(order1).toMatch(/^HC-\d{8}-[A-Z0-9]{6}$/)
      expect(order2).toMatch(/^HC-\d{8}-[A-Z0-9]{6}$/)
      expect(order1).not.toBe(order2)
    })

    it('should include current date in order number', () => {
      const orderNumber = generateOrderNumber()
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      expect(orderNumber).toContain(today)
    })
  })
})

describe('Export Utilities', () => {
  describe('arrayToCSV', () => {
    it('should convert array of objects to CSV string', () => {
      const data = [
        { id: 1, name: 'Test 1', price: 25.00 },
        { id: 2, name: 'Test 2', price: 35.00 }
      ]
      
      const csv = arrayToCSV(data)
      const lines = csv.split('\n')
      
      expect(lines[0]).toBe('id,name,price')
      expect(lines[1]).toBe('1,Test 1,25')
      expect(lines[2]).toBe('2,Test 2,35')
    })

    it('should handle empty array', () => {
      const csv = arrayToCSV([])
      expect(csv).toBe('')
    })

    it('should use custom column definitions', () => {
      const data = [
        { id: 1, name: 'Test', price: 25.00, hidden: 'secret' }
      ]
      
      const columns = [
        { key: 'id' as const, label: 'ID' },
        { key: 'name' as const, label: 'Name' }
      ]
      
      const csv = arrayToCSV(data, columns)
      const lines = csv.split('\n')
      
      expect(lines[0]).toBe('ID,Name')
      expect(lines[1]).toBe('1,Test')
      expect(csv).not.toContain('secret')
    })
  })

  describe('downloadCSV', () => {
    it('should create download with correct filename', () => {
      // Mock URL.createObjectURL and document.createElement
      global.URL.createObjectURL = jest.fn(() => 'mock-url')
      global.URL.revokeObjectURL = jest.fn()
      
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
        style: { display: '' }
      }
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
      
      downloadCSV('test,data', 'test-file')
      
      expect(mockLink.download).toBe('test-file.csv')
      expect(mockLink.click).toHaveBeenCalled()
    })
  })
})

// Test helper functions
export const testHelpers = {
  createMockCartItem: (overrides = {}) => ({
    menu_item_id: 'test-item-1',
    name: 'Test Item',
    price: 10.99,
    category: 'service',
    ...overrides
  }),
  
  createMockService: (overrides = {}) => ({
    id: 'service-1',
    name_en: 'Test Service',
    name_sl: 'Test Storitev',
    price: 25.00,
    duration: 60,
    category: 'Yoga',
    status: 'published',
    ...overrides
  }),
  
  createMockBooking: (overrides = {}) => ({
    id: 'booking-1',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    service_name: 'Morning Yoga',
    date: '2025-01-20',
    time: '09:00',
    status: 'confirmed',
    price: 25.00,
    ...overrides
  })
}

// Export utility functions for testing
export const testUtils = {
  mockCartItems: [
    { id: '1', name: 'Test Service', price: 25.00, quantity: 1, type: 'service' },
    { id: '2', name: 'Test Menu', price: 10.00, quantity: 2, type: 'menu' }
  ],
  
  mockUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User'
  },
  
  mockService: {
    id: 'test-service-id',
    name_en: 'Test Service',
    name_sl: 'Test Storitev',
    price: 25.00,
    duration: 60,
    category: 'Yoga'
  }
}
