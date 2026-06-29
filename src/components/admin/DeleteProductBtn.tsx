'use client'
// src/components/admin/DeleteProductBtn.tsx
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteProductBtn({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Product deleted')
      router.refresh()
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <button onClick={handleDelete} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
