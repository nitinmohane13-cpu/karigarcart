'use client'
// src/components/shop/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import type { ProductWithCategory } from '@/types'

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const addItem = useCartStore((s) => s.addItem)
  const [imgError, setImgError] = useState(false)

  const discount = Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      mrp: Number(product.mrp),
      image: product.images[0],
      stock: product.stock,
      sku: product.sku,
    })
    toast.success('Added to cart')
  }

  return (
    <Link href={`/shop/${product.slug}`} className="card group overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {product.images[0] && !imgError ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 badge bg-brand-600 text-white">{discount}% off</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-gray-800 text-white text-sm py-1 px-3">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
        <p className="text-sm font-semibold text-dark line-clamp-2 flex-1 mb-2">{product.name}</p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-dark">{formatPrice(Number(product.price))}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(Number(product.mrp))}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
