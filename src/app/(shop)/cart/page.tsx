'use client'
// src/app/(shop)/cart/page.tsx
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCartStore()
  const subtotal = total()
  const shipping = subtotal >= 999 ? 0 : 99
  const grandTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-5" />
        <h2 className="font-display text-2xl font-bold text-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some tools and get building!</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : '🔧'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark text-sm line-clamp-2 mb-1">{item.name}</p>
                <p className="text-xs text-gray-400 mb-3">SKU: {item.sku}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-2 hover:bg-gray-50 disabled:opacity-40">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-dark">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h3 className="font-display font-bold text-lg text-dark mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brand-600">Add {formatPrice(999 - subtotal)} more for free shipping</p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-dark">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center mt-5 block">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="btn-ghost w-full text-center mt-2 block text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
