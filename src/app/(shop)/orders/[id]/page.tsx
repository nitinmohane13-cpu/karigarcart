// src/app/(shop)/orders/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, Clock, Truck } from 'lucide-react'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true },
  })

  if (!order || order.userId !== session.user.id) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <CheckCircle className="w-7 h-7 text-green-500" />
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="card p-4 mb-5 flex items-center gap-3">
        {order.status === 'SHIPPED' || order.status === 'DELIVERED' ? (
          <Truck className="w-5 h-5 text-brand-600" />
        ) : (
          <Clock className="w-5 h-5 text-yellow-500" />
        )}
        <div>
          <p className="font-semibold text-dark">{order.status}</p>
          <p className="text-sm text-gray-500">Payment: {order.paymentStatus}</p>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-dark mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST</span><span>{formatPrice(Number(order.gstAmount))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{Number(order.shippingCharge) === 0 ? 'FREE' : formatPrice(Number(order.shippingCharge))}</span>
          </div>
          <div className="flex justify-between font-bold text-dark text-base pt-1 border-t border-gray-100">
            <span>Total</span><span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {order.address && (
        <div className="card p-5">
          <h2 className="font-semibold text-dark mb-3">Delivery Address</h2>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="font-medium text-dark">{order.address.name}</p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            <p>{order.address.phone}</p>
          </div>
        </div>
      )}
    </div>
  )
}
