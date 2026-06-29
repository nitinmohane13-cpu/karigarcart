'use client'
// src/components/shop/ShopFilters.tsx
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'

interface Category { id: string; name: string; slug: string }

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(params.get('search') || '')

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    startTransition(() => router.push(`/shop?${next}`))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    update('search', search)
  }

  const currentCat = params.get('category') || ''
  const currentSort = params.get('sort') || ''

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="input pl-9 text-sm"
          />
        </div>
      </form>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm text-dark mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => update('category', '')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!currentCat ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => update('category', c.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${currentCat === c.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-sm text-dark mb-3">Sort By</h3>
        <select
          value={currentSort}
          onChange={(e) => update('sort', e.target.value)}
          className="input text-sm"
        >
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  )
}
