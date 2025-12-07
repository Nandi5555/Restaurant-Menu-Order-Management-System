import { z } from 'zod'

// User schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Menu item schemas
export const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category_id: z.string().uuid('Invalid category ID').nullable(),
  tags: z.array(z.string()).default([]),
  is_available: z.boolean().default(true),
  inventory_count: z.number().int().nonnegative().nullable(),
})

// Cart schemas
export const addToCartSchema = z.object({
  menu_item_id: z.string().uuid('Invalid menu item ID'),
  quantity: z.number().int().positive().min(1).max(20, 'Maximum quantity is 20'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().min(1).max(20, 'Maximum quantity is 20'),
})

// Order schemas
export const deliveryAddressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().regex(/^\d{6}$/, 'ZIP code must be 6 digits'),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Phone number must be 10-15 digits'),
  instructions: z.string().optional(),
})

export const createOrderSchema = z.object({
  delivery_address: deliveryAddressSchema,
  payment_method: z.enum(['card', 'cash', 'upi']),
})

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().nullable(),
})

// Search and filter schemas
export const menuFilterSchema = z.object({
  category: z.string().uuid().optional(),
  search: z.string().optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  available: z.boolean().optional(),
})

// AI generation schemas
export const generateDescriptionSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const recommendItemsSchema = z.object({
  item_id: z.string().uuid('Invalid item ID'),
  limit: z.number().int().positive().max(10).default(4),
})

// File upload schemas
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 4 * 1024 * 1024, 'File size must be less than 4MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPG, PNG, and WebP images are allowed'
    ),
})

// Order status update schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled']),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})