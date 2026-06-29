// src/app/admin/products/new/page.tsx
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Add Product</h1>
      <ProductForm categories={categories} mode="new" />
    </div>
  )
}
