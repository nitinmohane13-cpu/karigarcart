'use client'
// src/app/(shop)/studio/page.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function StudioGate() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // If already has access, go straight to collection
  useEffect(() => {
    fetch('/api/studio/check')
      .then(r => r.json())
      .then(d => {
        if (d.access) router.replace('/studio/collection')
        else setChecking(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/studio/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Welcome')
      router.push('/studio/collection')
    } else {
      toast.error('Incorrect password')
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0f1e 50%, #1a0a2e 100%)' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #ff006e, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{ background: 'radial-gradient(circle, #8338ec, transparent)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #ff006e, transparent)', animationDelay: '2s' }} />
      </div>

      {/* Watermark graphic emojis */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
        {['🌹', '💋', '🥂', '💎', '🕯️', '🌙', '✨', '💄', '🫦', '🍾'].map((emoji, i) => (
          <span key={i} className="absolute text-6xl"
            style={{
              top: `${10 + (i * 17) % 80}%`,
              left: `${5 + (i * 23) % 90}%`,
              transform: `rotate(${(i * 37) % 60 - 30}deg)`,
            }}>
            {emoji}
          </span>
        ))}
      </div>

      {/* Gate card */}
      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ background: 'linear-gradient(135deg, #ff006e, #8338ec)' }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
            Studio
          </h1>
          <p className="text-pink-300 text-sm tracking-widest uppercase">Private Collection</p>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: 'linear-gradient(to right, transparent, #ff006e, transparent)' }} />
        </div>

        {/* Age gate notice */}
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl text-center justify-center"
          style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.2)' }}>
          <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <p className="text-pink-300 text-xs">For adults 18+ only. By entering you confirm your age.</p>
        </div>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter access code"
              className="w-full px-5 py-4 pr-12 rounded-xl text-white placeholder-pink-800 focus:outline-none focus:ring-2 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,0,110,0.3)',
                focusRingColor: '#ff006e',
              }}
              required
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-300 transition-colors">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #ff006e, #8338ec)' }}
          >
            {loading ? 'Verifying…' : 'Enter Studio'}
          </button>
        </form>

        <p className="text-center text-pink-900 text-xs mt-8">
          Studio is a private, invitation-only collection.
        </p>
      </div>
    </div>
  )
}
