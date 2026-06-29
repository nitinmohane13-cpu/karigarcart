'use client'
// src/components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Tags, Settings, Wrench, LogOut, Warehouse } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-dark text-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-1.5 rounded-lg">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg">DIY Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1">
          <Wrench className="w-4 h-4" /> View Store
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}
