'use client'
// src/components/shop/AddToCartBtn.tsx
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  product: { id: string; name: string; price: number; mrp: number; image?: string; stock: number; sku: string }
}

export default function AddToCartBtn({ product }: Props) {
  const { items, addItem, updateQty } = useCartStore()
  const existing = items.find((i) => i.id === product.id)

  const handleAdd = () => {
    addItem(product)
    toast.success('Added to cart')
  }

  if (existing) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => updateQty(product.id, existing.quantity - 1)} className="p-3 hover:bg-gray-50 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 py-2 font-semibold text-dark min-w-[3rem] text-center">{existing.quantity}</span>
          <button
            onClick={() => updateQty(product.id, existing.quantity + 1)}
            disabled={existing.quantity >= product.stock}
            className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <a href="/cart" className="btn-secondary text-sm flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> View Cart
        </a>
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className="btn-primary flex items-center gap-2 py-3 px-8 text-base"
    >
      <ShoppingCart className="w-5 h-5" />
      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
