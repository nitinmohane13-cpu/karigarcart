// src/app/admin/orders/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: { include: { product: { select: { slug: true } } } },
      address: true,
    },
  })

  if (!order) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Status control */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Order Status</p>
          <p className="text-xs text-gray-400 mt-0.5">Payment: {order.paymentStatus} {order.razorpayPaymentId && `· ${order.razorpayPaymentId}`}</p>
        </div>
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Customer */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-dark mb-3">Customer</h2>
        <p className="font-medium text-dark">{order.user.name}</p>
        <p className="text-sm text-gray-500">{order.user.email}</p>
        {order.user.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
      </div>

      {/* Items */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-dark mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <Link href={`/shop/${item.product.slug}`} className="text-sm font-medium text-dark hover:text-brand-600">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400">SKU: {item.sku} · GST: {Number(item.gstRate)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatPrice(Number(item.price) * item.quantity)}</p>
                <p className="text-xs text-gray-400">{formatPrice(Number(item.price))} × {item.quantity}</p>
              </div>
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
          <div className="flex justify-between font-bold text-base text-dark pt-1 border-t border-gray-100">
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
