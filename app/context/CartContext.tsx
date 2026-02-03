'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { Cart, CartItem, CartContextType } from '../types/cart'
import {
  createEmptyCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart as clearCartUtil,
  saveCartToStorage,
  loadCartFromStorage,
  validateCart,
  hasItems
} from '../lib/utils/cart'

// Cart actions
type CartAction =
  | { type: 'LOAD_CART'; payload: Cart | null }
  | { type: 'ADD_ITEM'; payload: { item: Omit<CartItem, 'id' | 'quantity' | 'added_at'>; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SYNC_SUCCESS'; payload: Cart }

// Cart state
interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: CartState = {
  cart: null,
  isLoading: true,
  error: null
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null
      }

    case 'ADD_ITEM':
      if (!state.cart) {
        const newCart = createEmptyCart()
        const updatedCart = addItemToCart(newCart, action.payload.item, action.payload.quantity)
        return {
          ...state,
          cart: updatedCart,
          error: null
        }
      }
      return {
        ...state,
        cart: addItemToCart(state.cart, action.payload.item, action.payload.quantity),
        error: null
      }

    case 'REMOVE_ITEM':
      if (!state.cart) return state
      return {
        ...state,
        cart: removeItemFromCart(state.cart, action.payload),
        error: null
      }

    case 'UPDATE_QUANTITY':
      if (!state.cart) return state
      return {
        ...state,
        cart: updateItemQuantity(state.cart, action.payload.itemId, action.payload.quantity),
        error: null
      }

    case 'CLEAR_CART':
      if (!state.cart) return state
      return {
        ...state,
        cart: clearCartUtil(state.cart),
        error: null
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'SYNC_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null
      }

    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = loadCartFromStorage()
        
        if (savedCart) {
          // Validate the loaded cart
          const validation = validateCart(savedCart)
          if (validation.isValid) {
            dispatch({ type: 'LOAD_CART', payload: savedCart })
          } else {
            console.warn('Loaded cart is invalid:', validation.errors)
            dispatch({ type: 'LOAD_CART', payload: createEmptyCart() })
          }
        } else {
          dispatch({ type: 'LOAD_CART', payload: createEmptyCart() })
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
        dispatch({ type: 'LOAD_CART', payload: createEmptyCart() })
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (state.cart && !state.isLoading) {
      saveCartToStorage(state.cart)
    }
  }, [state.cart, state.isLoading])

  // Cart actions
  const addItem = useCallback((item: Omit<CartItem, 'id' | 'quantity' | 'added_at'>, quantity: number = 1) => {
    try {
      dispatch({ type: 'ADD_ITEM', payload: { item, quantity } })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' })
    }
  }, [])

  const removeItem = useCallback((itemId: string) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId })
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' })
    }
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
    } catch (error) {
      console.error('Failed to update item quantity:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' })
    }
  }, [])

  const clearCart = useCallback(() => {
    try {
      dispatch({ type: 'CLEAR_CART' })
    } catch (error) {
      console.error('Failed to clear cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' })
    }
  }, [])

  // Cart calculations
  const getItemCount = useCallback(() => {
    return state.cart?.total_items || 0
  }, [state.cart])

  const getTotalPrice = useCallback(() => {
    return state.cart?.total_price || 0
  }, [state.cart])

  const getItemById = useCallback((itemId: string) => {
    return state.cart?.items.find(item => item.id === itemId)
  }, [state.cart])

  // Persistence functions
  const syncCart = useCallback(async () => {
    if (!state.cart) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // TODO: Implement server sync when user is authenticated
      // For now, just validate and save locally
      const validation = validateCart(state.cart)
      if (!validation.isValid) {
        throw new Error(`Cart validation failed: ${validation.errors.join(', ')}`)
      }
      
      saveCartToStorage(state.cart)
      dispatch({ type: 'SYNC_SUCCESS', payload: state.cart })
      
    } catch (error) {
      console.error('Failed to sync cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart' })
    }
  }, [state.cart])

  const loadCart = useCallback(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const savedCart = loadCartFromStorage()
      dispatch({ type: 'LOAD_CART', payload: savedCart || createEmptyCart() })
    } catch (error) {
      console.error('Failed to load cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
    }
  }, [])

  const saveCart = useCallback(() => {
    if (state.cart) {
      try {
        saveCartToStorage(state.cart)
      } catch (error) {
        console.error('Failed to save cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save cart' })
      }
    }
  }, [state.cart])

  // Context value
  const contextValue: CartContextType = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getItemById,
    syncCart,
    loadCart,
    saveCart
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Hook to check if cart has items
export function useCartHasItems(): boolean {
  const { cart } = useCart()
  return hasItems(cart)
}

// Hook to get cart item count
export function useCartItemCount(): number {
  const { getItemCount } = useCart()
  return getItemCount()
}

// Hook to get cart total price
export function useCartTotalPrice(): number {
  const { getTotalPrice } = useCart()
  return getTotalPrice()
}
