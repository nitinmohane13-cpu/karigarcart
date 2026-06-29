// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Wrench } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-white text-lg">Karigar Cart</span>
            </div>
            <p className="text-sm text-gray-400">India's home for handcrafted gifts, antiques, pottery and artisan goods.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=handmade-decor" className="hover:text-white transition-colors">Handmade Decor</Link></li>
              <li><Link href="/shop?category=gifts-hampers" className="hover:text-white transition-colors">Gifts & Hampers</Link></li>
              <li><Link href="/shop?category=antiques-vintage" className="hover:text-white transition-colors">Antiques</Link></li>
              <li><Link href="/shop?category=pottery-ceramics" className="hover:text-white transition-colors">Pottery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">namaste@karigarcart.in</li>
              <li className="text-gray-400">+91 98765 43210</li>
              <li className="text-gray-400">Mon–Sat 9am–6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Karigar Cart. All rights reserved.</p>
          <p>GST: 27AABCU9603R1ZM</p>
        </div>
      </div>
    </footer>
  )
}
