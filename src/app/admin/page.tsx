// src/app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react'

async function getStats() {
  const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ])
  return { totalOrders, totalRevenue: totalRevenue._sum.total || 0, totalProducts, totalUsers, recentOrders }
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function AdminDashboard() {
  const { totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders } = await getStats()

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Products', value: totalProducts, icon: Package, color: 'bg-orange-50 text-orange-600' },
    { label: 'Customers', value: totalUsers, icon: Users, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-dark">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-dark">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-brand-600 hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-mono text-xs font-medium text-brand-600">
                    <a href={`/admin/orders/${o.id}`}>{o.orderNumber}</a>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-dark">{o.user.name}</p>
                    <p className="text-xs text-gray-400">{o.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
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
