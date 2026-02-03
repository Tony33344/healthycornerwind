import { Cart, CartItem, CartValidationResult, CartStats, CART_STORAGE_KEY, CART_EXPIRY_HOURS } from '../../types/cart'

/**
 * Create a new empty cart
 */
export function createEmptyCart(): Cart {
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + CART_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
  
  return {
    id: generateCartId(),
    items: [],
    total_items: 0,
    total_price: 0,
    created_at: now,
    updated_at: now,
    expires_at: expiresAt
  }
}

/**
 * Generate a unique cart ID
 */
export function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Add item to cart
 */
export function addItemToCart(cart: Cart, newItem: Omit<CartItem, 'id' | 'quantity' | 'added_at'>, quantity: number = 1): Cart {
  const existingItemIndex = cart.items.findIndex(item => item.menu_item_id === newItem.menu_item_id)
  
  let updatedItems: CartItem[]
  
  if (existingItemIndex >= 0) {
    // Update existing item quantity
    updatedItems = cart.items.map((item, index) => 
      index === existingItemIndex 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  } else {
    // Add new item
    const cartItem: CartItem = {
      ...newItem,
      id: generateCartItemId(),
      quantity,
      added_at: new Date().toISOString()
    }
    updatedItems = [...cart.items, cartItem]
  }
  
  return updateCartTotals({
    ...cart,
    items: updatedItems,
    updated_at: new Date().toISOString()
  })
}

/**
 * Remove item from cart
 */
export function removeItemFromCart(cart: Cart, itemId: string): Cart {
  const updatedItems = cart.items.filter(item => item.id !== itemId)
  
  return updateCartTotals({
    ...cart,
    items: updatedItems,
    updated_at: new Date().toISOString()
  })
}

/**
 * Update item quantity in cart
 */
export function updateItemQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeItemFromCart(cart, itemId)
  }
  
  const updatedItems = cart.items.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  )
  
  return updateCartTotals({
    ...cart,
    items: updatedItems,
    updated_at: new Date().toISOString()
  })
}

/**
 * Clear all items from cart
 */
export function clearCart(cart: Cart): Cart {
  return updateCartTotals({
    ...cart,
    items: [],
    updated_at: new Date().toISOString()
  })
}

/**
 * Update cart totals based on items
 */
export function updateCartTotals(cart: Cart): Cart {
  const total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const total_price = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return {
    ...cart,
    total_items,
    total_price: Math.round(total_price * 100) / 100 // Round to 2 decimal places
  }
}

/**
 * Generate cart item ID
 */
export function generateCartItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate cart
 */
export function validateCart(cart: Cart): CartValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check if cart is expired
  if (cart.expires_at && new Date(cart.expires_at) < new Date()) {
    errors.push('Cart has expired')
  }
  
  // Check if cart is empty
  if (cart.items.length === 0) {
    warnings.push('Cart is empty')
  }
  
  // Validate each item
  cart.items.forEach((item, index) => {
    if (!item.menu_item_id) {
      errors.push(`Item ${index + 1}: Missing menu item ID`)
    }
    
    if (!item.name) {
      errors.push(`Item ${index + 1}: Missing name`)
    }
    
    if (item.price < 0) {
      errors.push(`Item ${index + 1}: Invalid price`)
    }
    
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Invalid quantity`)
    }
    
    if (item.max_quantity && item.quantity > item.max_quantity) {
      warnings.push(`Item ${index + 1}: Quantity exceeds maximum (${item.max_quantity})`)
    }
  })
  
  // Check for duplicate items (same menu_item_id)
  const menuItemIds = cart.items.map(item => item.menu_item_id)
  const duplicates = menuItemIds.filter((id, index) => menuItemIds.indexOf(id) !== index)
  if (duplicates.length > 0) {
    warnings.push('Cart contains duplicate items')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get cart statistics
 */
export function getCartStats(cart: Cart): CartStats {
  const categories = cart.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity
    return acc
  }, {} as Record<string, number>)
  
  const sortedItems = [...cart.items].sort((a, b) => b.price - a.price)
  
  return {
    total_items: cart.total_items,
    total_price: cart.total_price,
    unique_items: cart.items.length,
    categories,
    most_expensive_item: sortedItems[0],
    least_expensive_item: sortedItems[sortedItems.length - 1]
  }
}

/**
 * Save cart to localStorage
 */
export function saveCartToStorage(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

/**
 * Load cart from localStorage
 */
export function loadCartFromStorage(): Cart | null {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return null
    
    const cart: Cart = JSON.parse(stored)
    
    // Check if cart is expired
    if (cart.expires_at && new Date(cart.expires_at) < new Date()) {
      removeCartFromStorage()
      return null
    }
    
    return cart
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return null
  }
}

/**
 * Remove cart from localStorage
 */
export function removeCartFromStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to remove cart from localStorage:', error)
  }
}

/**
 * Merge two carts (useful for syncing with server)
 */
export function mergeCarts(localCart: Cart, serverCart: Cart): Cart {
  const mergedItems: CartItem[] = []
  const processedMenuItemIds = new Set<string>()
  
  // Process local cart items first
  localCart.items.forEach(localItem => {
    const serverItem = serverCart.items.find(item => item.menu_item_id === localItem.menu_item_id)
    
    if (serverItem) {
      // Merge quantities, keep most recent data
      mergedItems.push({
        ...localItem,
        quantity: localItem.quantity + serverItem.quantity
      })
    } else {
      mergedItems.push(localItem)
    }
    
    processedMenuItemIds.add(localItem.menu_item_id)
  })
  
  // Add server items that weren't in local cart
  serverCart.items.forEach(serverItem => {
    if (!processedMenuItemIds.has(serverItem.menu_item_id)) {
      mergedItems.push(serverItem)
    }
  })
  
  return updateCartTotals({
    ...localCart,
    items: mergedItems,
    updated_at: new Date().toISOString()
  })
}

/**
 * Format cart for display
 */
export function formatCartForDisplay(cart: Cart) {
  return {
    ...cart,
    formatted_total: `€${cart.total_price.toFixed(2)}`,
    items: cart.items.map(item => ({
      ...item,
      formatted_price: `€${item.price.toFixed(2)}`,
      formatted_total: `€${(item.price * item.quantity).toFixed(2)}`
    }))
  }
}

/**
 * Check if cart has items
 */
export function hasItems(cart: Cart | null): boolean {
  return cart !== null && cart.items.length > 0
}

/**
 * Get item by ID
 */
export function getItemById(cart: Cart, itemId: string): CartItem | undefined {
  return cart.items.find(item => item.id === itemId)
}

/**
 * Calculate cart weight (for delivery estimation)
 */
export function calculateCartWeight(cart: Cart): number {
  // Estimate weight based on categories (in kg)
  const categoryWeights = {
    'Meals': 0.5,
    'Snacks': 0.2,
    'Beverages': 0.3,
    'Supplements': 0.1
  }
  
  return cart.items.reduce((total, item) => {
    const weight = categoryWeights[item.category as keyof typeof categoryWeights] || 0.3
    return total + (weight * item.quantity)
  }, 0)
}
