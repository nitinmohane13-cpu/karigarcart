// src/app/admin/categories/page.tsx
import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Categories</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  )
}
