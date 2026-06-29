// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

function adminGuard(session: any) {
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const guard = adminGuard(session)
  if (guard) return guard

  const body = await req.json()
  const { name, description, price, mrp, sku, stock, categoryId, tags, gstRate, isActive, isFeatured, images } = body

  const slug = slugify(name)

  try {
    const product = await prisma.product.create({
      data: { name, slug, description, price, mrp, sku, stock, categoryId, tags, gstRate, isActive, isFeatured, images },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'SKU or slug already exists' }, { status: 409 })
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
