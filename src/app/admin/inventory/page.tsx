// src/app/admin/inventory/page.tsx
import { prisma } from '@/lib/prisma'
import StockAdjuster from '@/components/admin/StockAdjuster'
import { AlertTriangle } from 'lucide-react'

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { stock: 'asc' },
  })

  const lowStock = products.filter((p) => p.stock <= 5)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Inventory</h1>

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm">{lowStock.length} product{lowStock.length > 1 ? 's' : ''} low on stock</p>
            <p className="text-yellow-700 text-xs mt-0.5">
              {lowStock.map((p) => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'SKU', 'Category', 'Current Stock', 'Adjust'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50/50' : p.stock <= 5 ? 'bg-yellow-50/50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-dark">{p.name}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{p.sku}</td>
                  <td className="px-5 py-3.5 text-gray-600">{p.category.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold text-base ${p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-yellow-600' : 'text-gray-800'}`}>
                      {p.stock}
                    </span>
                    {p.stock === 0 && <span className="ml-2 badge bg-red-100 text-red-600 text-xs">Out of stock</span>}
                    {p.stock > 0 && p.stock <= 5 && <span className="ml-2 badge bg-yellow-100 text-yellow-700 text-xs">Low</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <StockAdjuster productId={p.id} currentStock={p.stock} />
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
