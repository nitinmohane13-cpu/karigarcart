'use client'
// src/app/(shop)/studio/collection/page.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, LogOut, Lock } from 'lucide-react'

interface Product {
  id: string; name: string; slug: string; price: number; mrp: number
  images: string[]; stock: number; sku: string; description: string | null
  category: { name: string }
}

export default function StudioCollection() {
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/studio/check')
      .then(r => r.json())
      .then(d => {
        if (!d.access) { router.replace('/studio'); return }
        fetch('/api/studio/products')
          .then(r => r.json())
          .then(data => { setProducts(data); setLoading(false) })
      })
  }, [])

  const handleAdd = (p: Product) => {
    if (p.stock === 0) return
    addItem({ id: p.id, name: p.name, price: p.price, mrp: p.mrp, image: p.images[0], stock: p.stock, sku: p.sku })
    toast.success('Added to cart')
  }

  const handleExit = async () => {
    await fetch('/api/studio/auth', { method: 'DELETE' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a0a0a, #2d0f1e, #1a0a2e)' }}>
        <div className="text-pink-300 text-sm animate-pulse">Loading collection…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0f1e 50%, #1a0a2e 100%)' }}>

      {/* Studio Navbar */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(26,10,10,0.95)', borderColor: 'rgba(255,0,110,0.2)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-pink-500" />
            <span className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: 'Georgia, serif' }}>STUDIO</span>
            <span className="text-pink-700 text-xs">· Private Collection</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="text-pink-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button onClick={handleExit} className="flex items-center gap-1.5 text-pink-600 hover:text-pink-300 text-xs transition-colors">
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-pink-500 text-xs tracking-[0.3em] uppercase mb-3">Exclusive · Private · Discreet</p>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Grownup Collection
          </h1>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(to right, transparent, #ff006e, transparent)' }} />
          <p className="text-pink-300 text-sm mt-4 max-w-md mx-auto">
            Curated for intimacy, wellness, and pleasure. All orders shipped in plain, discreet packaging.
          </p>
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌹</p>
            <p className="text-pink-300">Collection coming soon</p>
            <p className="text-pink-700 text-sm mt-2">Check back shortly</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => {
              const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100)
              return (
                <div key={p.id} className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,0,110,0.15)' }}>
                  {/* Image */}
                  <div className="relative aspect-square bg-black/30 flex items-center justify-center overflow-hidden">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="text-5xl">🌹</div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #ff006e, #8338ec)' }}>
                        {discount}% off
                      </span>
                    )}
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-white/10">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-pink-600 text-xs mb-1">{p.category.name}</p>
                    <p className="text-white text-sm font-medium line-clamp-2 flex-1 mb-2">{p.name}</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-white font-bold">{formatPrice(p.price)}</span>
                      {discount > 0 && <span className="text-pink-800 text-xs line-through">{formatPrice(p.mrp)}</span>}
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={p.stock === 0}
                      className="w-full py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                      style={{ background: p.stock === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #ff006e, #8338ec)' }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Discreet shipping notice */}
        <div className="mt-16 text-center p-6 rounded-2xl" style={{ background: 'rgba(255,0,110,0.05)', border: '1px solid rgba(255,0,110,0.1)' }}>
          <p className="text-pink-300 text-sm">🔒 All orders are shipped in plain, unmarked packaging. Billing name: <strong>KC Retail</strong>.</p>
        </div>
      </div>
    </div>
  )
}
