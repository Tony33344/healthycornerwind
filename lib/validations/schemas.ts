import { z } from 'zod'

// ============================================================================
// SERVICE SCHEMAS
// ============================================================================
export const serviceSchema = z.object({
  name_sl: z.string().min(1, 'Slovenian name is required'),
  name_nl: z.string().min(1, 'Dutch name is required'),
  name_en: z.string().min(1, 'English name is required'),
  name_de: z.string().min(1, 'German name is required'),
  description_sl: z.string().optional(),
  description_nl: z.string().optional(),
  description_en: z.string().optional(),
  description_de: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().int().positive('Duration must be positive'),
  capacity: z.number().int().positive('Capacity must be positive'),
  category: z.enum(['Yoga', 'Ice Bathing', 'Workshops', 'Packages']),
  image_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
})

export type ServiceInput = z.infer<typeof serviceSchema>

// ============================================================================
// MENU ITEM SCHEMAS
// ============================================================================
export const menuItemSchema = z.object({
  name_sl: z.string().min(1, 'Slovenian name is required'),
  name_nl: z.string().min(1, 'Dutch name is required'),
  name_en: z.string().min(1, 'English name is required'),
  name_de: z.string().min(1, 'German name is required'),
  description_sl: z.string().optional(),
  description_nl: z.string().optional(),
  description_en: z.string().optional(),
  description_de: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  ingredients_sl: z.string().optional(),
  ingredients_nl: z.string().optional(),
  ingredients_en: z.string().optional(),
  ingredients_de: z.string().optional(),
  allergens: z.array(z.string()).default([]),
  category: z.enum(['Snacks', 'Meals', 'Beverages', 'Supplements']),
  image_url: z.string().url().optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  status: z.enum(['draft', 'published']).default('draft'),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>

// ============================================================================
// BOOKING SCHEMAS
// ============================================================================
export const bookingSchema = z.object({
  schedule_id: z.string().uuid('Invalid schedule ID'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>

// ============================================================================
// CONTACT FORM SCHEMAS
// ============================================================================
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ============================================================================
// NEWSLETTER SCHEMAS
// ============================================================================
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

// ============================================================================
// CART SCHEMAS
// ============================================================================
export const cartItemSchema = z.object({
  menu_item_id: z.string().uuid('Invalid menu item ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
})

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
})

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof cartSchema>

// ============================================================================
// ORDER SCHEMAS
// ============================================================================
export const orderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().min(0),
})

export const shippingAddressSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postal_code: z.string().min(3),
  country: z.string().min(2),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shipping_address: shippingAddressSchema,
})

export type OrderItem = z.infer<typeof orderItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderInput = z.infer<typeof orderSchema>

// ============================================================================
// TESTIMONIAL SCHEMAS
// ============================================================================
export const testimonialSchema = z.object({
  guest_name: z.string().min(2, 'Name must be at least 2 characters'),
  quote_sl: z.string().min(10, 'Quote must be at least 10 characters'),
  quote_nl: z.string().min(10, 'Quote must be at least 10 characters'),
  quote_en: z.string().min(10, 'Quote must be at least 10 characters'),
  quote_de: z.string().min(10, 'Quote must be at least 10 characters'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>
