// Cart types for the wellness retreat platform

export interface CartItem {
  id: string
  menu_item_id: string
  name: string
  description?: string
  price: number
  quantity: number
  image_url?: string
  category: string
  allergens?: string[]
  max_quantity?: number
  added_at: string
}

export interface Cart {
  id: string
  items: CartItem[]
  total_items: number
  total_price: number
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  
  // Cart actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity' | 'added_at'>, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // Cart calculations
  getItemCount: () => number
  getTotalPrice: () => number
  getItemById: (itemId: string) => CartItem | undefined
  
  // Persistence
  syncCart: () => Promise<void>
  loadCart: () => void
  saveCart: () => void
}

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export interface CartIconProps {
  className?: string
  showBadge?: boolean
  onClick?: () => void
}

export interface AddToCartButtonProps {
  menuItem: {
    id: string
    name: string
    description?: string
    price: number
    image_url?: string
    category: string
    allergens?: string[]
    stock?: number
  }
  quantity?: number
  disabled?: boolean
  className?: string
  onAdd?: (item: CartItem) => void
}

// Checkout related types
export interface CheckoutFormData {
  customer: {
    name: string
    email: string
    phone?: string
  }
  delivery: {
    type: 'pickup' | 'delivery'
    address?: {
      street: string
      city: string
      postal_code: string
      country: string
    }
    date: string
    time: string
    notes?: string
  }
  payment: {
    method: 'cash' | 'card' | 'bank_transfer'
  }
}

export interface Order {
  id: string
  order_number: string
  customer: CheckoutFormData['customer']
  items: CartItem[]
  delivery: CheckoutFormData['delivery']
  payment: CheckoutFormData['payment']
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  total_items: number
  total_price: number
  created_at: string
  updated_at: string
}

// Local storage keys
export const CART_STORAGE_KEY = 'healthy-corner-cart'
export const CART_EXPIRY_HOURS = 24

// Cart validation
export interface CartValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Cart statistics
export interface CartStats {
  total_items: number
  total_price: number
  unique_items: number
  categories: Record<string, number>
  most_expensive_item?: CartItem
  least_expensive_item?: CartItem
}
