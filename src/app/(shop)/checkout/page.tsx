'use client'
// src/app/(shop)/checkout/page.tsx
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Address {
  name: string; line1: string; line2: string; city: string; state: string; pincode: string; phone: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [address, setAddress] = useState<Address>({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const subtotal = total()
  const shipping = subtotal >= 999 ? 0 : 99
  const grandTotal = subtotal + shipping

  if (!session) {
    router.push('/auth/login?next=/checkout')
    return null
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }))
  }

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handlePlaceOrder = async () => {
    const required = ['name', 'line1', 'city', 'state', 'pincode', 'phone'] as const
    for (const f of required) {
      if (!address[f]) { toast.error(`Please fill in ${f}`); return }
    }

    setLoading(true)
    try {
      // Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal, items, address, shipping }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      await loadRazorpay()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'DIY Store',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          // Verify + create order
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              orderId: data.orderId,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            clearCart()
            toast.success('Order placed successfully!')
            router.push(`/orders/${data.orderId}`)
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: address.phone,
        },
        theme: { color: '#ea580c' },
        modal: { ondismiss: () => setLoading(false) },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-semibold text-dark text-lg mb-5">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input name="name" value={address.name} onChange={handleChange} className="input" placeholder="John Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input name="line1" value={address.line1} onChange={handleChange} className="input" placeholder="Flat / House no., Street" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input name="line2" value={address.line2} onChange={handleChange} className="input" placeholder="Area, Landmark (optional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input name="city" value={address.city} onChange={handleChange} className="input" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input name="state" value={address.state} onChange={handleChange} className="input" placeholder="Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input name="pincode" value={address.pincode} onChange={handleChange} className="input" placeholder="400001" maxLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input name="phone" value={address.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h3 className="font-display font-bold text-lg text-dark mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">{i.name} × {i.quantity}</span>
                <span className="font-medium flex-shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-dark pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary w-full mt-5 text-base py-3"
          >
            {loading ? 'Processing…' : `Pay ${formatPrice(grandTotal)}`}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Secured by Razorpay</p>
        </div>
      </div>
    </div>
  )
}
