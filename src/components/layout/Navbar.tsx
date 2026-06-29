'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Menu, X, Wrench } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const itemCount = useCartStore((s) => s.itemCount())
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const navLinks = [
    { href: '/shop', label: 'All Crafts' },
    { href: '/shop?category=handmade-decor', label: 'Decor' },
    { href: '/shop?category=gifts-hampers', label: 'Gifts' },
    { href: '/shop?category=antiques-vintage', label: 'Antiques' },
    { href: '/shop?category=pottery-ceramics', label: 'Pottery' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl text-dark">Karigar Cart</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="btn-ghost text-sm">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative btn-ghost p-2">
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="btn-ghost p-2 flex items-center gap-1.5 text-sm">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{session.user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="p-1">
                    <Link href="/orders" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">My Orders</Link>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-brand-600 font-medium">Admin Panel</Link>
                    )}
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-red-600">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm hover:bg-gray-50 rounded-lg">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
