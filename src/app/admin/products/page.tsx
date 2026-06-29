// src/app/admin/products/page.tsx
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Edit, Package } from 'lucide-react'
import DeleteProductBtn from '@/components/admin/DeleteProductBtn'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-dark">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover rounded-lg" alt="" /> : '🔧'}
                      </div>
                      <span className="font-medium text-dark line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3.5 text-gray-600">{p.category.name}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(Number(p.price))}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-dark transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductBtn id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No products yet</p>
              <Link href="/admin/products/new" className="btn-primary mt-4 inline-block text-sm">Add your first product</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
