'use client'
// src/components/admin/OrderStatusUpdate.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success('Status updated')
      router.refresh()
    } else {
      toast.error('Failed to update')
      setStatus(currentStatus)
    }
  }

  return (
    <select value={status} onChange={handleChange} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500">
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
