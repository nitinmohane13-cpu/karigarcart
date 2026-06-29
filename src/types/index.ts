// src/types/index.ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  description: string | null
  price: any
  mrp: any
  sku: string
  stock: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  gstRate: any
  tags: string[]
  category: { id: string; name: string; slug: string }
}

export interface OrderWithItems {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: any
  gstAmount: any
  shippingCharge: any
  total: any
  createdAt: Date
  items: {
    id: string
    name: string
    sku: string
    price: any
    quantity: number
    gstRate: any
  }[]
  address: {
    name: string
    line1: string
    line2?: string | null
    city: string
    state: string
    pincode: string
    phone: string
  } | null
}
