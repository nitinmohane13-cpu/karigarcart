// src/app/api/razorpay/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json()

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSig !== razorpay_signature) {
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'FAILED' } })
    return NextResponse.json({ success: false, error: 'Invalid signature' })
  }

  // Update order + decrement stock
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) return NextResponse.json({ success: false, error: 'Order not found' })

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED', razorpayPaymentId: razorpay_payment_id, paymentMethod: 'razorpay' },
    }),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ])

  return NextResponse.json({ success: true })
}
