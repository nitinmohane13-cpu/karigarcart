'use client'
// src/components/admin/StockAdjuster.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Minus, Check } from 'lucide-react'

export default function StockAdjuster({ productId, currentStock }: { productId: string; currentStock: number }) {
  const [delta, setDelta] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    if (delta === 0) return
    setLoading(true)
    const res = await fetch(`/api/admin/inventory/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    })
    if (res.ok) {
      toast.success(`Stock ${delta > 0 ? 'added' : 'reduced'}`)
      setDelta(0)
      router.refresh()
    } else {
      toast.error('Failed to update stock')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setDelta((d) => Math.max(d - 1, -currentStock))}
          className="p-1.5 hover:bg-gray-50 text-gray-500"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          value={delta}
          onChange={(e) => setDelta(Math.max(-currentStock, parseInt(e.target.value) || 0))}
          className="w-14 text-center text-sm py-1 border-0 focus:outline-none font-medium"
        />
        <button onClick={() => setDelta((d) => d + 1)} className="p-1.5 hover:bg-gray-50 text-gray-500">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {delta !== 0 && (
        <button
          onClick={handleApply}
          disabled={loading}
          className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          title="Apply"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
      {delta !== 0 && (
        <span className={`text-xs font-medium ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
          → {currentStock + delta}
        </span>
      )}
    </div>
  )
}
