// src/app/api/studio/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // Guard — must have studio cookie
  const cookie = req.cookies.get('studio_access')
  if (cookie?.value !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: { in: ['grownup', 'grownup-collection'] } } },
        { category: { name: { contains: 'grownup', mode: 'insensitive' } } },
      ],
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize Decimals
  const serialized = products.map(p => ({
    ...p,
    price: Number(p.price),
    mrp: Number(p.mrp),
    gstRate: Number(p.gstRate),
  }))

  return NextResponse.json(serialized)
}
