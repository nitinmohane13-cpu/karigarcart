// src/app/(shop)/shop/page.tsx
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import { Suspense } from 'react'

interface Props {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
  }
}

const PAGE_SIZE = 12

async function getProducts(params: Props['searchParams']) {
  const page = parseInt(params.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const where: any = { isActive: true }

  if (params.category) {
    where.category = { slug: params.category }
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { tags: { has: params.search.toLowerCase() } },
      { sku: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const orderBy: any =
    params.sort === 'price_asc' ? { price: 'asc' }
    : params.sort === 'price_desc' ? { price: 'desc' }
    : params.sort === 'newest' ? { createdAt: 'desc' }
    : { isFeatured: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy, skip, take: PAGE_SIZE }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, totalPages: Math.ceil(total / PAGE_SIZE) }
}

async function getCategories() {
  return prisma.category.findMany({ where: { isActive: true } })
}

export default async function ShopPage({ searchParams }: Props) {
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <Suspense>
            <ShopFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              {total} product{total !== 1 ? 's' : ''}
              {searchParams.search && ` for "${searchParams.search}"`}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try different filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium border transition-colors ${
                    p === page
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
