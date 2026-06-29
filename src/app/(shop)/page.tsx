// src/app/(shop)/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import { ArrowRight, Truck, Star, RefreshCw, Headphones } from 'lucide-react'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: true },
    take: 8,
  })
}

async function getCategories() {
  return prisma.category.findMany({ where: { isActive: true }, take: 6 })
}

function serializeProduct(p: any) {
  return {
    ...p,
    price: p.price.toNumber(),
    mrp: p.mrp.toNumber(),
    gstRate: p.gstRate.toNumber(),
  }
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'handmade-decor':    '🪔',
  'gifts-hampers':     '🎁',
  'antiques-vintage':  '🏺',
  'candles-aromas':    '🕯️',
  'pottery-ceramics':  '🫙',
  'handloom-textiles': '🧵',
}

export default async function HomePage() {
  const [rawProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])
  const products = rawProducts.map(serializeProduct)

  const features = [
    { icon: Truck,      title: 'Free Delivery',       desc: 'On orders above ₹999' },
    { icon: Star,       title: 'Handpicked Artisans', desc: 'Verified karigars only' },
    { icon: RefreshCw,  title: 'Easy Returns',        desc: '7-day hassle-free returns' },
    { icon: Headphones, title: 'Artisan Support',     desc: 'Mon–Sat 9am–6pm helpline' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[580px] flex items-center" style={{ backgroundColor: '#1a1008' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')" }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,16,8,0.94) 0%, rgba(26,16,8,0.80) 55%, rgba(26,16,8,0.30) 100%)' }} />
        <div className="absolute inset-0" style={{ opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L43 37 L80 40 L43 43 L40 80 L37 43 L0 40 L37 37Z' fill='%23f97316'/%3E%3C/svg%3E\")", backgroundSize: '80px 80px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.18) 0%, transparent 70%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-5/12 bg-cover bg-center opacity-20 hidden lg:block" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80')", WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)', maskImage: 'linear-gradient(to right, transparent 0%, black 50%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 w-full">
          <div className="max-w-xl">
            <p className="text-brand-400 font-medium text-xs tracking-[0.25em] uppercase mb-4">🪔 India's Artisan Marketplace</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
              Handmade.<br />Heartfelt.<br /><span className="text-brand-400">Truly Indian.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 max-w-md leading-relaxed">
              Discover one-of-a-kind handcrafted gifts, antiques, pottery, handloom and more. Made by karigars across India, delivered to your door.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/shop" className="btn-primary text-base py-3 px-7 flex items-center gap-2">Explore Collection <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/shop?category=gifts-hampers" className="text-base py-3 px-7 flex items-center gap-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">Shop Gifts 🎁</Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div><p className="text-white font-bold text-xl">500+</p><p className="text-gray-400 text-xs">Artisans</p></div>
              <div className="w-px h-8 bg-white/20" />
              <div><p className="text-white font-bold text-xl">10K+</p><p className="text-gray-400 text-xs">Products</p></div>
              <div className="w-px h-8 bg-white/20" />
              <div><p className="text-white font-bold text-xl">4.8★</p><p className="text-gray-400 text-xs">Avg Rating</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="bg-brand-50 text-brand-600 p-2 rounded-lg flex-shrink-0"><f.icon className="w-5 h-5" /></div>
                <div><p className="font-semibold text-sm text-dark">{f.title}</p><p className="text-xs text-gray-500">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-display text-2xl font-bold text-dark">Shop by Craft</h2>
          <Link href="/shop" className="text-brand-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">All crafts <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="card p-4 text-center hover:border-brand-200 hover:shadow-md transition-all duration-150 group">
              <div className="text-3xl mb-2">{CATEGORY_EMOJIS[cat.slug] || '🎨'}</div>
              <p className="text-sm font-semibold text-dark group-hover:text-brand-600 transition-colors leading-tight">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="font-display text-2xl font-bold text-dark">Featured Pieces</h2>
            <p className="text-gray-500 text-sm mt-0.5">Handpicked by our artisan curators</p>
          </div>
          <Link href="/shop" className="text-brand-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (<ProductCard key={p.id} product={p as any} />))}
        </div>
      </section>

      {/* Story banner */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1a1008' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601046668428-94ea13437736?w=1400&q=80')" }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,16,8,0.92), rgba(26,16,8,0.60))' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-lg">
            <p className="text-brand-400 text-xs font-medium tracking-widest uppercase mb-3">Our Promise</p>
            <h2 className="font-display text-3xl font-bold mb-3">Every piece tells a story</h2>
            <p className="text-gray-300 text-base leading-relaxed">Each item on Karigar Cart is handcrafted by a verified artisan. When you buy here, you support a family, a craft, and a tradition passed down for generations.</p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/shop" className="btn-primary text-base py-3 px-8 flex items-center gap-2">Free shipping above ₹999 <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
