// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Edit Product</h1>
      <ProductForm categories={categories} product={product} mode="edit" />
    </div>
  )
}
