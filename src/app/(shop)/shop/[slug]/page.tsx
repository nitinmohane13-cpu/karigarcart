// src/app/(shop)/shop/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import AddToCartBtn from '@/components/shop/AddToCartBtn'
import { Package, Tag, CheckCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  return { title: product ? `${product.name} — DIY Store` : 'Product Not Found' }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { category: true },
  })

  if (!product) notFound()

  const discount = Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
  const savings = Number(product.mrp) - Number(product.price)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-8xl">🔧</div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-brand-600 font-medium mb-2">{product.category.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-dark">{formatPrice(Number(product.price))}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(Number(product.mrp))}</span>
                <span className="badge bg-green-100 text-green-700 text-sm py-0.5">{discount}% off</span>
              </>
            )}
          </div>
          {savings > 0 && (
            <p className="text-sm text-green-600 mb-5">You save {formatPrice(savings)}</p>
          )}

          {/* Stock */}
          <div className={`flex items-center gap-2 mb-6 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <CheckCircle className="w-4 h-4" />
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </div>

          {/* Add to cart */}
          <AddToCartBtn product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            mrp: Number(product.mrp),
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          }} />

          {/* Meta */}
          <div className="border-t border-gray-100 mt-8 pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              <span>SKU: <span className="font-mono font-medium">{product.sku}</span></span>
            </div>
            {product.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {product.tags.map((t) => (
                  <span key={t} className="badge bg-gray-100 text-gray-600">{t}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>GST included @ {Number(product.gstRate)}%</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-100 mt-6 pt-6">
              <h3 className="font-semibold text-dark mb-2">About this product</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
