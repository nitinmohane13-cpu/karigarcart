// src/app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Orders</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-mono text-xs font-medium text-brand-600">
                    <Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-dark">{o.user.name}</p>
                    <p className="text-xs text-gray-400">{o.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{o.items.length}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(Number(o.total))}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${o.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <OrderStatusUpdate orderId={o.id} currentStatus={o.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${o.id}`} className="text-brand-600 text-xs hover:underline">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
