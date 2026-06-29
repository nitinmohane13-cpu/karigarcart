// src/app/api/razorpay/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount, items, address, shipping } = await req.json()
  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })

  // Validate stock for all items
  const productIds = items.map((i: any) => i.id)
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } })

  for (const item of items) {
    const product = products.find((p) => p.id === item.id)
    if (!product) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 })
    if (product.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock: ${product.name}` }, { status: 400 })
  }

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
  const gstAmount = items.reduce((s: number, i: any) => {
    const base = (i.price / 1.18) * i.quantity
    return s + (i.price * i.quantity - base)
  }, 0)
  const grandTotal = subtotal + (shipping || 0)

  // Create Razorpay order
  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(grandTotal * 100),
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  })

  // Create order record in DB
  const savedAddress = await prisma.address.create({
    data: {
      userId: session.user.id,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
    },
  })

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      addressId: savedAddress.id,
      razorpayOrderId: rzpOrder.id,
      subtotal,
      gstAmount: Math.round(gstAmount * 100) / 100,
      shippingCharge: shipping || 0,
      total: grandTotal,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      items: {
        create: items.map((i: any) => ({
          productId: i.id,
          name: i.name,
          sku: i.sku,
          price: i.price,
          quantity: i.quantity,
          gstRate: 18,
        })),
      },
    },
  })

  return NextResponse.json({
    razorpayOrderId: rzpOrder.id,
    orderId: order.id,
    amount: rzpOrder.amount,
  })
}
