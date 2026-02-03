import { Cart, Order, CheckoutFormData } from '../../types/cart'

/**
 * Generate a unique order number in format: HC-YYYYMMDD-XXXX
 * HC = Healthy Corner
 * YYYYMMDD = Current date
 * XXXX = Random 4-digit number
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  // Generate random 4-digit number
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  
  return `HC-${dateStr}-${randomNum}`
}

/**
 * Create an order from cart and checkout data
 */
export function createOrderFromCart(
  cart: Cart,
  checkoutData: CheckoutFormData,
  orderNumber?: string
): Omit<Order, 'id' | 'created_at' | 'updated_at'> {
  return {
    order_number: orderNumber || generateOrderNumber(),
    customer: checkoutData.customer,
    items: cart.items,
    delivery: checkoutData.delivery,
    payment: checkoutData.payment,
    status: 'pending',
    total_items: cart.total_items,
    total_price: cart.total_price
  }
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: Cart['items']) {
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0)
  const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return {
    total_items,
    total_price: Math.round(total_price * 100) / 100 // Round to 2 decimal places
  }
}

/**
 * Validate order data
 */
export function validateOrder(order: Partial<Order>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!order.order_number) {
    errors.push('Order number is required')
  }
  
  if (!order.customer?.name) {
    errors.push('Customer name is required')
  }
  
  if (!order.customer?.email) {
    errors.push('Customer email is required')
  }
  
  if (!order.items || order.items.length === 0) {
    errors.push('Order must contain at least one item')
  }
  
  if (!order.delivery?.type) {
    errors.push('Delivery type is required')
  }
  
  if (!order.delivery?.date) {
    errors.push('Delivery date is required')
  }
  
  if (!order.delivery?.time) {
    errors.push('Delivery time is required')
  }
  
  if (!order.payment?.method) {
    errors.push('Payment method is required')
  }
  
  // Validate email format
  if (order.customer?.email && !isValidEmail(order.customer.email)) {
    errors.push('Invalid email format')
  }
  
  // Validate delivery address if delivery type is 'delivery'
  if (order.delivery?.type === 'delivery') {
    if (!order.delivery.address?.street) {
      errors.push('Delivery address is required')
    }
    if (!order.delivery.address?.city) {
      errors.push('Delivery city is required')
    }
    if (!order.delivery.address?.postal_code) {
      errors.push('Delivery postal code is required')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Format order for display
 */
export function formatOrderForDisplay(order: Order) {
  return {
    ...order,
    formatted_total: `€${order.total_price.toFixed(2)}`,
    formatted_date: new Date(order.created_at).toLocaleDateString('sl-SI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    delivery_date: new Date(order.delivery.date).toLocaleDateString('sl-SI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

/**
 * Get order status display info
 */
export function getOrderStatusInfo(status: Order['status']) {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'yellow',
      description: 'Order received, awaiting confirmation'
    },
    confirmed: {
      label: 'Confirmed',
      color: 'blue',
      description: 'Order confirmed, being prepared'
    },
    preparing: {
      label: 'Preparing',
      color: 'orange',
      description: 'Your order is being prepared'
    },
    ready: {
      label: 'Ready',
      color: 'green',
      description: 'Order ready for pickup/delivery'
    },
    completed: {
      label: 'Completed',
      color: 'green',
      description: 'Order completed successfully'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'red',
      description: 'Order has been cancelled'
    }
  }
  
  return statusMap[status] || statusMap.pending
}

/**
 * Calculate estimated preparation time based on items
 */
export function calculateEstimatedPrepTime(items: Cart['items']): number {
  // Base time: 15 minutes
  let totalMinutes = 15
  
  // Add time based on quantity and complexity
  items.forEach(item => {
    // Add 2 minutes per item
    totalMinutes += item.quantity * 2
    
    // Add extra time for complex categories
    if (item.category === 'Meals') {
      totalMinutes += item.quantity * 5
    } else if (item.category === 'Beverages') {
      totalMinutes += item.quantity * 1
    }
  })
  
  // Round to nearest 5 minutes
  return Math.ceil(totalMinutes / 5) * 5
}

/**
 * Generate order summary for email/receipt
 */
export function generateOrderSummary(order: Order): string {
  const items = order.items.map(item => 
    `${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`
  ).join('\n')
  
  return `
Order #${order.order_number}
Date: ${new Date(order.created_at).toLocaleString('sl-SI')}

Customer: ${order.customer.name}
Email: ${order.customer.email}
${order.customer.phone ? `Phone: ${order.customer.phone}` : ''}

Items:
${items}

Delivery: ${order.delivery.type === 'pickup' ? 'Pickup' : 'Delivery'}
${order.delivery.type === 'delivery' && order.delivery.address ? 
  `Address: ${order.delivery.address.street}, ${order.delivery.address.city} ${order.delivery.address.postal_code}` : ''}
Date: ${order.delivery.date}
Time: ${order.delivery.time}
${order.delivery.notes ? `Notes: ${order.delivery.notes}` : ''}

Payment: ${order.payment.method}

Total: €${order.total_price.toFixed(2)}
Status: ${getOrderStatusInfo(order.status).label}
  `.trim()
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
